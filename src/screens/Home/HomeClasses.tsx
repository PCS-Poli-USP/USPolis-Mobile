import { useEffect, useMemo, useState } from "react";
import { ClassModalDetails, HStack, Typography, VStack } from "@/components";
import FeatherIcons from "@expo/vector-icons/Feather";
import { useClasses } from "@/hooks/react-query/useClasses";
import { IClass } from "@/dtos";
import { ActivityIndicator, Pressable } from "react-native";
import { getUniqueValues } from "@/utils/array";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/theme/theme";
import { getFilteredClasses, getFilteredCourses } from "./utils";
import { logger } from "@/services/logger";
import React from "react";
import { useCourses } from "@/hooks/react-query/useCourses";
import { ICourse } from "@/dtos/courses";
import { useFullSearch } from "./FullSearchDrawer/context";

interface HomeClassesProps {
  buildingFilter: string;
  nameFilter?: string;
}

export const HomeClasses = ({
  buildingFilter,
  nameFilter,
}: HomeClassesProps) => {
  const { data: classes, isLoading: isLoadingClasses } = useClasses();
  const { data: courses, isLoading: isLoadingCourses } = useCourses();
  const [filteredClasses, setFilteredClasses] = useState<IClass[]>([])
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([])

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    const cancelTimeout = setTimeout(() => {
      const filteredClasses = getFilteredClasses({
        classes: classes || [],
        buildingFilter,
        nameFilter: nameFilter || '',
      })
  
      setFilteredClasses(filteredClasses)
      setIsLoading(false)
    }, 2)

    return () => {
      clearTimeout(cancelTimeout)
    }
  }, [classes, nameFilter, buildingFilter])

  useEffect(() => {
    setIsLoading(true)

    const cancelTimeout = setTimeout(() => {
      if (nameFilter || buildingFilter) {
        const filteredCourses = getFilteredCourses({
          courses: courses || [],
          buildingFilter,
          nameFilter: nameFilter || '',
        })
        setFilteredCourses(filteredCourses || [])
        setIsLoading(false)
      } else {
        const filteredCourses = getFilteredCourses({
          courses: courses || [],
          buildingFilter,
          nameFilter: nameFilter || '',
        }).slice(0, 3)
        setFilteredCourses(filteredCourses || [])
        setIsLoading(false)
      }
    }, 2)

    return () => {
      clearTimeout(cancelTimeout)
    }
  }, [courses, nameFilter, buildingFilter])

  return (
    <VStack>
      <HStack flex={1} justifyContent={"space-between"} marginBottom={'xs'}>
        <Typography color="grayTwo" fontWeight={"bold"}>
          Aulas
        </Typography>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Typography color="grayTwo">{filteredClasses?.length + filteredCourses?.length}</Typography>
        )}
      </HStack>

      {/* Todo: return skeleton loading */}
      {(isLoading || isLoadingClasses) && <ActivityIndicator />}

      {!isLoadingCourses && !isLoading && 
        filteredCourses?.map((item, index) => (
          <HomeCourseCard
            course={item}
            key={`${item.id}-${index}`}
          />
      ))}
      {!isLoadingClasses && !isLoading && 
        filteredClasses.map((item, index) => (
          <MemoHomeClassCard
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

  const selectClass = () => {
    setIsClassModalOpen(true)
    logger.logEvent('Aula Visualizada', { class: sclass.subject_name, screen: 'Home' })
  }

  return (
    <>
      <Pressable onPress={selectClass}>
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
      </Pressable>
      <ClassModalDetails
        sclass={sclass}
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
      />
    </>
  );
};

interface HomeCourseCardProps {
  course: ICourse
}

export const HomeCourseCard = ({
  course,
}: HomeCourseCardProps) => {
  const { colors } = useTheme<Theme>();
  const { handleUpdateInfos } = useFullSearch()

  const selectCourse = () => {
    handleUpdateInfos({
      isDrawerOpen: true,
      course: course.id,
    })
    logger.logEvent('Curso selecionado', { course: course.program, screen: 'Home' })
  }

  return (
    <>
      <Pressable onPress={selectCourse}>
        <HStack
          borderWidth={2}
          borderColor="secondary"
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
              {course.program}
            </Typography>

            <Typography color="grayTwo" marginBottom={'xxs'} numberOfLines={2}>
              {' '}
            </Typography>
            <Typography color="secondary" numberOfLines={2} variant="heading">
              CURSO
            </Typography>
          </VStack>
          <FeatherIcons name="chevron-right" color={colors.secondary} size={24} />
        </HStack>
      </Pressable>
    </>
  );
};

const MemoHomeClassCard = React.memo(HomeClassCard);
