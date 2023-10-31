import api from '@/services/api'
import { useMutation } from 'react-query'
import { queryClient } from '../client'

const handleLike = async (id: string) => {
  const response = await api.patch(`/institutional-events/${id}/like`)
  queryClient.invalidateQueries('events')

  return response.data
}

export const useHandleLike = () => {
  const mutation = useMutation(['useHandleLike'], handleLike)

  return mutation
}
