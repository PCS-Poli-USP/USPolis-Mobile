import { BuildingFilter } from "@/components";
import { Building } from "@/dtos/classes";
import FeatherIcons from "@expo/vector-icons/Feather";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import {
  Center,
  Heading,
  IconButton,
  Image,
  VStack,
  useTheme,
} from "native-base";
import { useEffect, useMemo, useState } from "react";
import { mapsImagePathTable } from "./utils";

export const Maps = () => {
  const [activeBuilding, setBuilding] = useState<Building>("Biênio");
  const [activeFloor, setFloor] = useState(0);

  const { colors } = useTheme();

  const hasPreviousFloor = useMemo(
    () =>
      Object.keys(mapsImagePathTable[activeBuilding]).some(
        (f) => Number(f) < activeFloor
      ),
    [activeBuilding, activeFloor]
  );

  const hasNextFloor = useMemo(
    () =>
      Object.keys(mapsImagePathTable[activeBuilding]).some(
        (f) => Number(f) > activeFloor
      ),
    [activeBuilding, activeFloor]
  );

  useEffect(() => {
    setFloor(0);
  }, [activeBuilding]);

  return (
    <VStack flex={1} bg="gray.700" pb={16}>
      <Center px={8}>
        <BuildingFilter
          activeBuilding={activeBuilding}
          selectBuilding={setBuilding}
        />
      </Center>

      <ReactNativeZoomableView
        key={`${activeBuilding}-${activeFloor}`}
        maxZoom={3}
        minZoom={1}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
      >
        <Image
          source={mapsImagePathTable[activeBuilding][activeFloor]}
          alt={`Mapa do ${activeBuilding}`}
          width="100%"
          height={280}
        />
      </ReactNativeZoomableView>
      {hasPreviousFloor && (
        <IconButton
          position="absolute"
          bottom={10}
          left={5}
          size="lg"
          rounded="full"
          variant="outline"
          bgColor="gray.700"
          borderColor="gray.300"
          disabled={!hasPreviousFloor}
          icon={
            <FeatherIcons
              color={colors.gray[300]}
              name="arrow-down"
              size={25}
            />
          }
          onPress={() => setFloor((floor) => floor - 1)}
        />
      )}

      {hasNextFloor && (
        <IconButton
          position="absolute"
          bottom={10}
          right={5}
          size="lg"
          rounded="full"
          variant="outline"
          bgColor="gray.700"
          borderColor="gray.300"
          disabled={!hasNextFloor}
          icon={
            <FeatherIcons color={colors.gray[300]} name="arrow-up" size={25} />
          }
          onPress={() => setFloor((floor) => floor + 1)}
        />
      )}
    </VStack>
  );
};
