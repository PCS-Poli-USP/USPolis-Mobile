import { IClass } from "@/dtos";
import { ClassesGroupedByWeekday } from "@/dtos/classes";
import { getUniqueValues } from "@/utils/array";
import { ScheduledClasses } from "../../dtos/classes";
import { parse } from "date-fns";
import { ptBR } from "date-fns/locale";

export const scheduleFactory = (
  schedule: string[],
  classes?: IClass[]
): ClassesGroupedByWeekday[] => {
  const classesOnSchedule =
    classes?.filter((c) => schedule.includes(c.id)) ?? [];

  const allClasses: ScheduledClasses[] = classesOnSchedule
    .map((c) =>
      c.schedule.map((s) => ({
        ...s,
        class_subject_name: c.subject_name,
        class_subject_code: c.subject_code,
        class_id: c.id,
        class_code: c.class_code,
      }))
    )
    .flat(1);

  const weekDaysWithClasses: string[] = getUniqueValues(
    allClasses.map((c) => c.week_day)
  ).sort(
    (a: string, b: string) =>
      parse(a, "EEEE", new Date(), { locale: ptBR }).getDay() -
      parse(b, "EEEE", new Date(), { locale: ptBR }).getDay()
  );

  return weekDaysWithClasses.map((week_day) => ({
    week_day,
    classes: allClasses.filter((c) => c.week_day === week_day),
  }));
};