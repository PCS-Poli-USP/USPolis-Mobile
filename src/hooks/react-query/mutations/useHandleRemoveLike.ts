import api from '@/services/api'
import { useMutation } from 'react-query'
import { queryClient } from '../client'

const handleRemoveLike = async (id: string) => {
  const response = await api.patch(`/institutional-events/${id}/remove-like`)

  queryClient.invalidateQueries('events')

  return response.data
}

export const useHandleRemoveLike = () => {
  const mutation = useMutation(['useHandleLike'], handleRemoveLike)

  return mutation
}
