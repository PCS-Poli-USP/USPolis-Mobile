import { Box, HStack, Pressable, Typography, VStack } from "@/components";
import { ClassesGroupedByWeekday } from "@/dtos/classes";
import { parse, format } from "date-fns";
import { ptBR } from "date-fns/locale";
interface DayClassesProps {
  onOpenModal: (classId: number, name: string) => void;
  classesGroup: ClassesGroupedByWeekday;
}

export const DayClasses = ({ onOpenModal, classesGroup }: DayClassesProps) => {
  const parsedWeekDay = parse(classesGroup.week_day, "EEEE", new Date(), {
    locale: ptBR,
  });
  console.log("Debugging: ", classesGroup.week_day, classesGroup.week_day)
  const weekdayAbbreviated = format(parsedWeekDay, "EEEEEE", { locale: ptBR });
  
  const orderedClasses = classesGroup.classes.sort((a, b) => {
    return a.start_time.localeCompare(b.start_time);
  });

  return (
    <Box width="100%" flexDirection="row" justifyContent="space-between">
      <Typography
        color={
          parsedWeekDay.getDay() === new Date().getDay()
            ? "primary"
            : "grayTwo"
        }
        fontSize={12}
      >
        {weekdayAbbreviated.toUpperCase()}.
      </Typography>
      <VStack width="80%" marginBottom={'s'}>
        {orderedClasses.map((sclass, index) => (
          <Pressable
            onPress={() => onOpenModal(sclass.class_id, sclass.class_subject_name)}
            backgroundColor="grayFive"
            borderRadius={8}
            marginBottom="s"
            padding={'m'}
            key={index}
          >
            <Typography variant="heading" color="white" fontSize={14} mb={'s'}>
              {sclass.class_subject_code} - {sclass.class_subject_name}
            </Typography>
            <Box flexDirection="row" justifyContent="space-between">
              <Typography color="grayTwo">
                {sclass.start_time} - {sclass.end_time}
              </Typography>
              <HStack gap={'s'}>
                <Typography color="grayTwo" marginRight={'s'}>{sclass.building}</Typography>
                <Typography color="white">{sclass.classroom}</Typography>
              </HStack>
            </Box>
          </Pressable>
        ))}
      </VStack>
    </Box>
  );
};
