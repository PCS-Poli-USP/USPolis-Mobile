import { useMemo, useState } from "react";
import {
  useDisclose,
} from "native-base";
import { ClassModalDetails, HStack, Typography, VStack } from "@/components";
import FeatherIcons from "@expo/vector-icons/Feather";
import { useClasses } from "@/hooks/react-query/useClasses";
import { IClass } from "@/dtos";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { getUniqueValues } from "@/utils/array";
import { replaceSpecialCharacters } from "@/utils/string";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/theme/theme";

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
      classesFiltered = classesFiltered?.filter(
        (c) =>
          replaceSpecialCharacters(c.subject_name.toLowerCase()).includes(
            replaceSpecialCharacters(nameFilter.toLowerCase())
          ) ||
          replaceSpecialCharacters((c.professor || "").toLowerCase()).includes(
            replaceSpecialCharacters(nameFilter.toLowerCase())
          ) ||
          replaceSpecialCharacters(c.subject_code.toLowerCase()).includes(
            replaceSpecialCharacters(nameFilter.toLowerCase())
          )
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
    console.log('press 1')
    setSelectedClass(classId);
    console.log('press 2')
    onOpen();
    console.log('press 3')
  };

  return (
    <>
      <ClassModalDetails
        classId={selectedClass}
        isOpen={isOpen}
        onClose={onClose}
      />
      <VStack>
        <HStack flex={1} justifyContent={"space-between"} marginBottom={'xs'}>
          <Typography color="grayTwo" fontWeight={"bold"}>
            Aulas
          </Typography>
          <Typography color="grayTwo">{filteredClasses.length}</Typography>
        </HStack>

        {/* Todo: return skeleton loading */}
        {isLoadingClasses && <ActivityIndicator />}

        {!isLoadingClasses &&
          filteredClasses.map((sclass, index) => (
            <HomeClassCard
              sclass={sclass}
              key={`${sclass.id}${sclass.schedule[0].id}${index}`}
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
  const { colors } = useTheme<Theme>();

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
        backgroundColor={"grayFive"}
        borderRadius={8}
        padding="xs"
        marginBottom="xs"
      >
        <VStack flex={1} marginRight={'xs'}>
          <Typography
            marginBottom={'xxs'}
            fontSize={18}
            color="white"
            variant={"heading"}
            fontWeight="bold"
            numberOfLines={1}
          >
            {sclass.subject_code} - {sclass.subject_name}
          </Typography>

          <Typography color="grayTwo" marginBottom={'xxs'} numberOfLines={2}>
            Turma {sclass.class_code.slice(-2)} - {buildings}
          </Typography>
          <Typography color="grayOne" numberOfLines={2} variant="heading">
            {classRooms}
          </Typography>
        </VStack>
        <FeatherIcons name="chevron-right" color={colors.grayThree} size={24} />
      </HStack>
    </TouchableOpacity>
  );
};
