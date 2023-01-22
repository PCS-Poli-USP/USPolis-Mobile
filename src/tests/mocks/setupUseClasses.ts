import { IClass } from "@/dtos";
import { apiMockAdapter } from "./api.mock";
import { setupUseQueryFactory, stubCaseGenerator } from "./factory";

const classesStub: IClass[] = [
  {
    id: '1',
    class_code: '2023109',
    subject_code: 'MAT3457',
    subject_name: 'Álgebra Linear I',
    start_period: '2023-03-13',
    end_period: '2023-07-15',
    schedule: [
      {
        id: '6390df7b0d97fb7dc1640196',
        week_day: 'Segunda-feira',
        start_time: '09:20',
        end_time: '11:00',
        building: 'Biênio',
        classroom: 'C1-04'
      },
      {
        id: 'asdfjasldjfkl1j1333',
        week_day: 'Quarta-feira',
        start_time: '09:20',
        end_time: '11:00',
        building: 'Biênio',
        classroom: 'C2-02'
      }
    ]
  },
  {
    id: '2',
    class_code: '2023109',
    subject_code: 'PRO3373',
    subject_name: 'Introdução à Economia',
    start_period: '2023-03-13',
    end_period: '2023-07-15',
    schedule: [
      {
        id: 'asdfasd12312312',
        week_day: 'Terça-feira',
        start_time: '09:20',
        end_time: '11:00',
        building: 'Biênio',
        classroom: 'C1-04'
      },
      {
        id: '12312431fdsfsdfsdf',
        week_day: 'Quinta-feira',
        start_time: '09:20',
        end_time: '11:00',
        building: 'Biênio',
        classroom: 'C2-02'
      }
    ]
  },
  {
    id: '3',
    class_code: '2023109',
    subject_code: 'PEA3100',
    subject_name: 'Energia, Meio Ambiente e Sustentabilidade',
    start_period: '2023-03-13',
    end_period: '2023-07-15',
    schedule: [
      {
        id: '6390df7b0d97fb7dc1233226',
        week_day: 'Segunda-feira',
        start_time: '09:20',
        end_time: '11:00',
        building: 'Biênio',
        classroom: 'C1-04'
      },
      {
        id: 'dddjasdlfjaskj1kl3j1klj',
        week_day: 'Sexta-feira',
        start_time: '14:20',
        end_time: '17:20',
        building: 'Biênio',
        classroom: 'C2-02'
      }
    ]
  },
]

export const setupUseClasses = setupUseQueryFactory(
  apiMockAdapter,
  /\/classes/,
  'onGet',
  stubCaseGenerator<any, string>()({
    default: {
      status: 200,
      data: [...classesStub],
    },
    error: {
      status: 500,
      error: 'Something went wrong',
    },
  })
)
