import { Box, BuildingFilter, IconButton, Typography, VStack } from "@/components";
import { Building } from "@/dtos/classes";
import { AppRoutesType } from "@/routes/app.routes";
import { logger } from "@/services/logger";
import { Theme } from "@/theme/theme";
import FeatherIcons from "@expo/vector-icons/Feather";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { useEffect, useMemo, useState } from "react";
import { Image } from "react-native";
import { mapsImagePathTable } from "./utils";

export const Maps = () => {
  const { params } = useRoute<RouteProp<AppRoutesType, "Maps">>();

  const [activeBuilding, setBuilding] = useState<Building>(
    params?.building || "Biênio"
  );
  const [activeFloor, setFloor] = useState(params?.floor || 0);

  useEffect(() => {
    if (params?.building) setBuilding(params.building || "Biênio");
    if (params?.floor) setFloor(params.floor || 0);
  }, [params]);

  const { colors } = useTheme<Theme>();

  const hasPreviousFloor = useMemo(
    () =>
      Object.keys(mapsImagePathTable[activeBuilding].images).some(
        (f) => Number(f) < activeFloor
      ),
    [activeBuilding, activeFloor]
  );

  const hasNextFloor = useMemo(
    () =>
      Object.keys(mapsImagePathTable[activeBuilding].images).some(
        (f) => Number(f) > activeFloor
      ),
    [activeBuilding, activeFloor]
  );

  useEffect(() => {
    setFloor(0);
  }, [activeBuilding]);

  const currentFloor = useMemo(() => {
    if (activeFloor === 0) {
      return 'Térreo'
    } else {
      return `${activeFloor}.º andar`
    }
  }, [activeFloor])

  const selectBuilding = (b: Building) => {
    if (activeBuilding !== b) {
      logger.logEvent('Edifício Selecionado', { building: b, screen: 'Mapas' })
      setBuilding(b)
    }
  }

  return (
    <VStack bg="graySeven" paddingBottom="l" height="100%">
      <Box px={'m'}>
        <BuildingFilter
          activeBuilding={activeBuilding}
          selectBuilding={selectBuilding}
        />
      </Box>

      <Box alignItems="center" justifyContent="center" bg={'grayFive'} p={'s'}>
        <Typography color='grayOne' fontSize={22}>{currentFloor}</Typography>
      </Box>

      <ReactNativeZoomableView
        key={`${activeBuilding}-${activeFloor}`}
        maxZoom={3}
        minZoom={1}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
      >
        <Image
          source={mapsImagePathTable[activeBuilding]["images"][activeFloor]}
          style={{
            width: "100%",
            height: mapsImagePathTable[activeBuilding].height,
            resizeMode: "contain",
          }}
        />
      </ReactNativeZoomableView>

      {hasPreviousFloor && (
        <IconButton
          style={{ position: "absolute", bottom: 30, left: 15 }}
          variant="outlined"
          disabled={!hasPreviousFloor}
          icon={
            <FeatherIcons
              color={colors.grayThree}
              name="arrow-down"
              size={25}
            />
          }
          onPress={() => setFloor((floor) => floor - 1)}
        />
      )}

      {hasNextFloor && (
        <IconButton
          style={{ position: "absolute", bottom: 30, right: 15 }}
          variant="outlined"
          disabled={!hasNextFloor}
          icon={
            <FeatherIcons color={colors.grayThree} name="arrow-up" size={25} />
          }
          onPress={() => setFloor((floor) => floor + 1)}
        />
      )}
    </VStack>
  );
};
