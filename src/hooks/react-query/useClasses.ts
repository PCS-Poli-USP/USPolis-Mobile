import { IClass } from '@/dtos'
import api from '@/services/api'
import { useQuery } from 'react-query'

export const useClasses = () => {
  const query = useQuery(['classes'], async () => {
    const response = await api.get<IClass[]>('/classes')
    return response.data
  })
  //console.log(query.data?.at(0)?.schedule.at(0)?.start_time)
  return query
}
