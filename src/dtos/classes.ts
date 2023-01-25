export type Schedule = {
  id: string;
  week_day: string;
  start_time: string;
  end_time: string;
  building: string;
  classroom: string;
};

export type IClass = {
  id: string;
  class_code: string;
  subject_code: string;
  subject_name: string;
  start_period: string;
  end_period: string;
  schedule: Array<Schedule>;
};

export type ClassesGroupedByWeekday = {
  week_day: string;
  classes: ScheduledClasses[];
};

export type ScheduledClasses = {
  class_subject_name: string;
  class_subject_code: string;
  class_id: string;
  class_code: string;
  week_day: string;
  start_time: string;
  end_time: string;
  building: string;
  classroom: string;
};
