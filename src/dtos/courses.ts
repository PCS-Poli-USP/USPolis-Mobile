import { IClass } from './classes'

export interface ICourse {
  id: string
  periods: number[]
  program: string
}

export interface ICourseProgram {
  subject_type: string
  period: number
  code: string
  name: string
  classes: IClass[]
}
