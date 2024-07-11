import { IClass } from '@/dtos'
import { ClassesGroupedByWeekday } from '@/dtos/classes'
import { getUniqueValues } from '@/utils/array'
import { ScheduledClasses } from '../../dtos/classes'
import { parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const scheduleFactory = (
  schedule: number[],
  classes?: IClass[],
): ClassesGroupedByWeekday[] => {
  const classesOnSchedule =
    classes?.filter((c) => schedule.includes(c.id)) ?? []
    console.log("classes:", classes![0].schedules)
console.log("classesonschedule:", classesOnSchedule)
  const allClasses: ScheduledClasses[] = classesOnSchedule
    .map((c) =>
      c.schedules.map((s) => ({
        ...s,
        class_subject_name: c.subject_name,
        class_subject_code: c.subject_code,
        class_id: c.id,
        class_code: c.code,
      })),
    )
    .flat(1)
    console.log("allClasses:", allClasses)
  const weekDaysWithClasses: string[] = getUniqueValues(
    allClasses.map((c) => c.week_day),
  ).sort(
    (a: string, b: string) =>
      parse(a, 'EEEE', new Date(), { locale: ptBR }).getDay() -
      parse(b, 'EEEE', new Date(), { locale: ptBR }).getDay(),
  )
  console.log("allClasses:", weekDaysWithClasses)
  return weekDaysWithClasses.map((weekDay) => ({
    week_day: weekDay,
    classes: allClasses.filter((c) => c.week_day === weekDay),
  }))
}
