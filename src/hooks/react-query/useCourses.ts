import { ICourse } from '@/dtos/courses'
import api from '@/services/api'
import { useQuery } from 'react-query'

export const useCourses = () => {
  const query = useQuery(['courses'], async () => {
    const response = await api.get<ICourse[]>('/programs')
    return response.data
  })

  return query
}
