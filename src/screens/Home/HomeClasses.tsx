import { useEffect, useMemo, useState } from "react";
import { ClassModalDetails, HStack, Typography, VStack } from "@/components";
import FeatherIcons from "@expo/vector-icons/Feather";
import { useClasses } from "@/hooks/react-query/useClasses";
import { IClass } from "@/dtos";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { getUniqueValues } from "@/utils/array";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/theme/theme";
import { getFilteredClasses } from "./utils";

interface HomeClassesProps {
  buildingFilter: string;
  nameFilter?: string;
}

export const HomeClasses = ({
  buildingFilter,
  nameFilter,
}: HomeClassesProps) => {
  const { data: classes, isLoading: isLoadingClasses } = useClasses();
  const [filteredClasses, setFilteredClasses] = useState<IClass[]>([])

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    setTimeout(() => {
      const filteredClasses = getFilteredClasses({
        classes: classes || [],
        buildingFilter,
        nameFilter: nameFilter || '',
      })
  
      setFilteredClasses(filteredClasses)
      setIsLoading(false)
    }, 2)
  }, [classes, nameFilter, buildingFilter])

  return (
    <VStack>
      <HStack flex={1} justifyContent={"space-between"} marginBottom={'xs'}>
        <Typography color="grayTwo" fontWeight={"bold"}>
          Aulas
        </Typography>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Typography color="grayTwo">{filteredClasses?.length}</Typography>
        )}
      </HStack>

      {/* Todo: return skeleton loading */}
      {(isLoading || isLoadingClasses) && <ActivityIndicator />}

      {!isLoadingClasses && !isLoading && 
        filteredClasses.map((item, index) => (
          <HomeClassCard
            sclass={item}
            key={`${item.id}-${index}`}
          />
      ))}
    </VStack>
  );
};

interface HomeClassCardProps {
  sclass: IClass;
}

export const HomeClassCard = ({
  sclass,
}: HomeClassCardProps) => {
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
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
    <>
      <TouchableOpacity onPress={() => setIsClassModalOpen(true)}>
        <HStack
          alignItems="center"
          backgroundColor={"grayFive"}
          borderRadius={8}
          padding="m"
          marginBottom="s"
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
      <ClassModalDetails
        sclass={sclass}
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
      />
    </>
  );
};
