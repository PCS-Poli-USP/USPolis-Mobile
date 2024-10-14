import { Schedule } from '@/dtos/classes'
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const sortEventsByScheduleTime = (current: Schedule, next: Schedule) => {
  const parsedCurrentWeekDay = parse(current.week_day, 'EEEE', new Date(), {
    locale: ptBR,
  })

  const parsedNextWeekDay = parse(next.week_day, 'EEEE', new Date(), {
    locale: ptBR,
  })

  return parsedCurrentWeekDay.getDay() - parsedNextWeekDay.getDay()
}

export const formatTime = (timeString:string) => {
  const [hours, minutes] = timeString.split(':');
  
  return `${hours}:${minutes}`;
};