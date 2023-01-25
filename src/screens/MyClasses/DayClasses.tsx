import { ClassesGroupedByWeekday } from "@/dtos/classes";
import { Flex, Text, HStack, VStack, Pressable, Heading } from "native-base";
import { parse, format } from "date-fns";
import { ptBR } from "date-fns/locale";
interface DayClassesProps {
  onOpenModal: (classId: string) => void;
  classesGroup: ClassesGroupedByWeekday;
}

export const DayClasses = ({ onOpenModal, classesGroup }: DayClassesProps) => {
  const parsedWeekDay = parse(classesGroup.week_day, "EEEE", new Date(), {
    locale: ptBR,
  });

  const weekdayAbbreviated = format(parsedWeekDay, "EEEEEE", { locale: ptBR });

  return (
    <Flex width="full" direction="row" justify="space-between" align="start">
      <Text
        color={
          parsedWeekDay.getDay() === new Date().getDay()
            ? "green.500"
            : "gray.200"
        }
        fontSize="sm"
      >
        {weekdayAbbreviated.toUpperCase()}.
      </Text>
      <VStack width="4/5" space="2.5">
        {classesGroup.classes.map((sclass, index) => (
          <Pressable
            onPress={() => onOpenModal(sclass.class_id)}
            bgColor="gray.500"
            rounded="lg"
            p="5"
            key={index}
          >
            <Heading color="white" fontSize="md" mb="4">
              {sclass.class_subject_code} - {sclass.class_subject_name}
            </Heading>
            <Flex direction="row" justify="space-between">
              <Text color="gray.200">
                {sclass.start_time} - {sclass.end_time}
              </Text>
              <HStack space="2.5">
                <Text color="gray.200">{sclass.building}</Text>
                <Text color="white">{sclass.classroom}</Text>
              </HStack>
            </Flex>
          </Pressable>
        ))}
      </VStack>
    </Flex>
  );
};
