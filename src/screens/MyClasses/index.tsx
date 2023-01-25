import {
  Center,
  Heading,
  VStack,
  IconButton,
  useTheme,
  Box,
  useDisclose,
} from "native-base";
import FeatherIcons from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { DayClasses } from "./DayClasses";
import { Layout, ClassModalDetails } from "@/components";
import { useClasses } from "@/hooks/react-query/useClasses";
import { useState } from "react";
import { useSchedule } from "@/hooks/useSchedule";
import { scheduleFactory } from "./utilts";

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
    <Box flex={1} bg="gray.700" px={5} pb={5}>
      <ClassModalDetails
        classId={selectedClass}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Layout>
        <Center mt={24} mb={6}>
          <Heading color="gray.100" fontSize="xxxl" fontFamily="heading">
            Minhas aulas
          </Heading>
        </Center>

        <VStack space="8">
          {classesGroupedByWeekday.map((group) => (
            <DayClasses
              onOpenModal={onOpenModal}
              key={group.week_day}
              classesGroup={group}
            />
          ))}
        </VStack>
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
        _pressed={{ bg: "gray.300", _icon: { color: "gray.700" } }}
        icon={<FeatherIcons name="plus" color={colors.gray[300]} size={25} />}
        onPress={() => navigation.navigate("Home")}
      />
    </Box>
  );
};
