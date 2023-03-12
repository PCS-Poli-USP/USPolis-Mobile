import FeatherIcons from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { DayClasses } from "./DayClasses";
import { Layout, ClassModalDetails, Box, VStack, Typography, Pressable } from "@/components";
import { useClasses } from "@/hooks/react-query/useClasses";
import { useState } from "react";
import { useSchedule } from "@/hooks/useSchedule";
import { scheduleFactory } from "./utils";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/theme/theme";
import { IClass } from "@/dtos";
import { ClassesGroupedByWeekday } from "@/dtos/classes";

export const MyClasses = () => {
  const [selectedClass, setSelectedClass] = useState<IClass | undefined>();
  const [isClassModalOpen, setIsClassModalOpen] = useState(false)

  const { colors } = useTheme<Theme>();
  const { data: classes } = useClasses();
  const { schedule } = useSchedule();
  const navigation = useNavigation();

  const classesGroupedByWeekday = scheduleFactory(schedule, classes);

  const onOpenModal = (classId: string) => {
    const sclass = classes?.find((c) => c.id === classId)
    setSelectedClass(sclass);
    setIsClassModalOpen(true);
  };

  return (
    <Box flex={1} backgroundColor="graySeven" paddingHorizontal="s" paddingTop={'m'} paddingBottom={'s'}>
      <Layout>
        <ClassModalDetails
          sclass={selectedClass}
          isOpen={isClassModalOpen}
          onClose={() => setIsClassModalOpen(false)}
        />
        <VStack height={"100%"}>
          {classesGroupedByWeekday.map((group: ClassesGroupedByWeekday) => (
            <DayClasses
              onOpenModal={onOpenModal}
              key={group.week_day}
              classesGroup={group}
            />
          ))}
        </VStack>
        {!classesGroupedByWeekday.length && (
          <Typography color="grayThree" fontSize={14} textAlign="center" marginTop={'m'}>
            Nenhuma aula adicionada
          </Typography>
        )}
      </Layout>
      <Pressable
        position="absolute"
        bottom={10}
        right={6}
        padding={'m'}
        borderWidth={1}
        backgroundColor="graySeven"
        alignItems="center"
        justifyContent="center"
        borderColor="grayThree"
        borderRadius={9999}
        onPress={() => navigation.navigate("Home" as never)}
      >
        <FeatherIcons name="plus" color={colors.grayThree} size={25} />
      </Pressable>
    </Box>
  );
};
