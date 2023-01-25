import { useMemo, useState, useEffect } from "react";
import {
  HStack,
  VStack,
  Text,
  Heading,
  useTheme,
  useDisclose,
} from "native-base";
import FeatherIcons from "@expo/vector-icons/Feather";
import { useClasses } from "@/hooks/react-query/useClasses";
import { IClass } from "@/dtos";
import { TouchableOpacity } from "react-native";
import { getUniqueValues } from "@/utils/array";
import { ClassModalDetails } from "@/components";

interface HomeClassesProps {
  buildingFilter?: string;
  nameFilter?: string;
}

export const HomeClasses = ({
  buildingFilter,
  nameFilter,
}: HomeClassesProps) => {
  const [selectedClass, setSelectedClass] = useState("");

  const { isOpen, onClose, onOpen } = useDisclose();
  const { data: classes, isLoading: isLoadingClasses } = useClasses();

  const filteredClasses = useMemo(() => {
    if (!classes) return [];

    let classesFiltered = [...classes];

    if (nameFilter) {
      classesFiltered = classesFiltered?.filter((c) =>
        c.subject_name.includes(nameFilter)
      );
    }

    if (buildingFilter) {
      classesFiltered = classesFiltered?.filter((c) => {
        const classesInBuilding = c.schedule.filter(
          (s) => s.building === buildingFilter
        );
        return classesInBuilding;
      });
    }

    return classesFiltered;
  }, []);

  const handleClassPress = (classId: string) => {
    setSelectedClass(classId);
    onOpen();
  };

  return (
    <>
      <ClassModalDetails
        classId={selectedClass}
        isOpen={isOpen}
        onClose={onClose}
      />
      <VStack>
        <HStack flex={1} justifyContent={"space-between"} mb={4}>
          <Text color="gray.200" fontWeight={"bold"}>
            Aulas
          </Text>
          <Text color="gray.200">{filteredClasses.length}</Text>
        </HStack>

        {/* Todo: return skeleton loading */}
        {isLoadingClasses && null}

        {!isLoadingClasses &&
          filteredClasses.map((sclass) => (
            <HomeClassCard
              sclass={sclass}
              key={sclass.id}
              handleClassPress={handleClassPress}
            />
          ))}
      </VStack>
    </>
  );
};

interface HomeClassCardProps {
  sclass: IClass;
  handleClassPress: (classId: string) => void;
}

export const HomeClassCard = ({
  sclass,
  handleClassPress,
}: HomeClassCardProps) => {
  const { colors } = useTheme();

  const classRooms = useMemo(() => {
    const classes = sclass.schedule.map((s) => s.classroom);
    const classrooms = getUniqueValues(classes);

    return classrooms.join(" | ");
  }, [sclass]);

  const buildings = useMemo(() => {
    const classes = sclass.schedule.map((s) => s.building);
    const classrooms = getUniqueValues(classes);

    return classrooms.join(", ");
  }, [sclass]);

  return (
    <TouchableOpacity onPress={() => handleClassPress(sclass.id)}>
      <HStack
        alignItems="center"
        bg="gray.500"
        rounded="md"
        px={4}
        py={4}
        mb={3}
      >
        <VStack flex={1} mr={3}>
          <Heading
            mb={1}
            fontSize="lg"
            color="white"
            fontFamily={"heading"}
            fontWeight="bold"
            numberOfLines={1}
          >
            {sclass.subject_code} - {sclass.subject_name}
          </Heading>

          <Text color="gray.200" mb={1} numberOfLines={2}>
            Turma {sclass.class_code.slice(-2)} - {buildings}
          </Text>
          <Text color="gray.100" numberOfLines={2} fontFamily={"heading"}>
            {classRooms}
          </Text>
        </VStack>
        <FeatherIcons name="chevron-right" color={colors.gray[300]} size={24} />
      </HStack>
    </TouchableOpacity>
  );
};
