import {
  VStack,
  IconButton,
  useTheme,
  Box,
  useDisclose,
  Text,
} from "native-base";
import FeatherIcons from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { DayClasses } from "./DayClasses";
import { Layout, ClassModalDetails } from "@/components";
import { useClasses } from "@/hooks/react-query/useClasses";
import { useState } from "react";
import { useSchedule } from "@/hooks/useSchedule";
import { scheduleFactory } from "./utils";

export const MyClasses = () => {
  const [selectedClass, setSelectedClass] = useState("");

  const { colors } = useTheme();
  const { onOpen, isOpen, onClose } = useDisclose();
  const { data: classes } = useClasses();
  const { schedule } = useSchedule();
  const navigation = useNavigation();

  const classesGroupedByWeekday = scheduleFactory(schedule, classes);

  const onOpenModal = (classId: string) => {
    setSelectedClass(classId);
    onOpen();
  };

  return (
    <Box flex={1} bg="gray.700" px={5} pt={10} pb={5}>
      <ClassModalDetails
        classId={selectedClass}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Layout>
        <VStack space="8">
          {classesGroupedByWeekday.map((group) => (
            <DayClasses
              onOpenModal={onOpenModal}
              key={group.week_day}
              classesGroup={group}
            />
          ))}
        </VStack>
        {!classesGroupedByWeekday.length && (
          <Text color="gray.300" fontSize="xl" textAlign="center" mt={8}>
            Nenhuma aula adicionada
          </Text>
        )}
      </Layout>
      <IconButton
        position="absolute"
        bottom="6"
        right="6"
        size="lg"
        variant="outline"
        bgColor="gray.700"
        borderColor="gray.300"
        rounded="full"
        icon={<FeatherIcons name="plus" color={colors.gray[300]} size={25} />}
        onPress={() => navigation.navigate("Home" as never)}
      />
    </Box>
  );
};
