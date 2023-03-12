import { Building as BuildingType } from "@/dtos/classes";
import { Theme } from "@/theme/theme";
import { createBox } from "@shopify/restyle";
import {
  FlatList,
  Pressable as NativePressable,
  PressableProps,
} from "react-native";
import { Box, Typography } from "../ui";

interface BuildingFilterProps {
  activeBuilding: string;
  selectBuilding: (building: BuildingType) => void;
}

const buildings: BuildingType[] = [
  "Biênio",
  "Elétrica",
  "Civil",
  "Produção",
  "Administração",
  "Metalúrgica",
  "Mecânica",
];

const Pressable = createBox<Theme, PressableProps>(NativePressable);

export const BuildingFilter = ({
  activeBuilding,
  selectBuilding,
}: BuildingFilterProps) => {
  return (
    <Box  my={"l"}>
      <FlatList
        horizontal
        data={buildings}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: building }) => (
          <Building
            isActive={activeBuilding === building}
            name={building}
            handleSelectBuilding={() => selectBuilding(building)}
          />
        )}
      />
    </Box>
  );
};

interface BuildingProps {
  name: string;
  isActive: boolean;
  handleSelectBuilding: () => void;
}

const Building = ({ name, isActive, handleSelectBuilding }: BuildingProps) => {
  return (
    <Pressable
      backgroundColor="graySix"
      padding={'s'}
      borderColor={isActive ? "primary" : "transparent"}
      borderWidth={isActive ? 1 : 0}
      borderRadius={4}
      mr={"xs"}
      alignItems="center"
      justifyContent="center"
      onPress={handleSelectBuilding}
    >
      <Typography
        color={isActive ? "primary" : "grayTwo"}
        fontSize={12}
        fontWeight="bold"
        px={"m"}
        textTransform={"uppercase"}
      >
        {name}
      </Typography>
    </Pressable>
  );
};
