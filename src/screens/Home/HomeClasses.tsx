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
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { getUniqueValues } from "@/utils/array";
import { ClassModalDetails } from "@/components";
import { replaceSpecialCharacters } from "@/utils/string";

interface HomeClassesProps {
  buildingFilter: string;
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
        replaceSpecialCharacters(c.subject_name.toLowerCase()).includes(replaceSpecialCharacters(nameFilter.toLowerCase())) ||
        replaceSpecialCharacters((c.professor || '').toLowerCase()).includes(replaceSpecialCharacters(nameFilter.toLowerCase())) || 
        replaceSpecialCharacters(c.subject_code.toLowerCase()).includes(replaceSpecialCharacters(nameFilter.toLowerCase()))
      );
    }

    if (buildingFilter) {
      classesFiltered = classesFiltered?.filter((c) => {
        const classesInBuilding = c.schedule.filter(
          (s) => s.building === buildingFilter
        );
        return !!classesInBuilding.length;
      });
    }

    return classesFiltered.sort((a, b) => {
      const aDate = new Date(a.start_period);
      const bDate = new Date(b.start_period);

      return aDate.getTime() - bDate.getTime();
    });
  }, [classes, nameFilter, buildingFilter]);

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
        {isLoadingClasses && (
          <ActivityIndicator />
        )}

        {!isLoadingClasses &&
          filteredClasses.map((sclass) => (
            <HomeClassCard
              sclass={sclass}
              key={`${sclass.id}${sclass.schedule[0].id}`}
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
