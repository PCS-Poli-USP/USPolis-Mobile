import { Box, Center, FlatList, Pressable, Text } from "native-base";
import { Building as BuildingType } from "@/dtos/classes";

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

export const BuildingFilter = ({
  activeBuilding,
  selectBuilding,
}: BuildingFilterProps) => {

  return (
    <Box h={10} my={10}>
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
      bg="gray.600"
      rounded="md"
      mr={3}
      alignItems="center"
      justifyContent="center"
      _pressed={{
        borderColor: "green.500",
        borderWidth: 1,
      }}
      isPressed={isActive}
      onPress={handleSelectBuilding}
    >
      <Text
        color={isActive ? "green.500" : "gray.200"}
        fontSize="xs"
        fontWeight="bold"
        px={8}
        textTransform={"uppercase"}
      >
        {name}
      </Text>
    </Pressable>
  );
};
