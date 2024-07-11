export type Building =
  | 'Biênio'
  | 'Mecânica'
  | 'Produção'
  | 'Administração'
  | 'Elétrica'
  | 'Metalúrgica'
  | 'Civil'

export type Schedule = {
  id: number
  week_day: string
  start_time: string
  end_time: string
  building: Building
  classroom: string
  floor: number
}

export type IClass = {
  id: number
  code: string
  professors: Array<string>
  subject_code: string
  subject_name: string
  start_date: string
  end_date: string
  schedules: Array<Schedule>
}

export type ScheduledClasses = {
  class_subject_name: string
  class_subject_code: string
  class_id: number
  class_code: string
  week_day: string
  start_time: string
  end_time: string
  building: Building
  classroom: string
}

export type ClassesGroupedByWeekday = {
  week_day: string
  classes: ScheduledClasses[]
}
