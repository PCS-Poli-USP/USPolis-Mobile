import { IEvent } from '@/dtos/events'
import api from '@/services/api'
import { useQuery } from 'react-query'

export const useEvents = () => {
  const query = useQuery(
    ['events'],
    async () => {
      const response = await api.get<IEvent[]>('/institutional-events')
      return response.data
    },
    {
      keepPreviousData: true,
    },
  )

  return query
}
