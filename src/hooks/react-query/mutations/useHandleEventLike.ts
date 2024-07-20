import api from '@/services/api'
import { useMutation } from 'react-query'
import { queryClient } from '../client'
import { type EventLikeDTO } from '@/dtos/events'

const handleEventLike = async (dto: EventLikeDTO) => {
  api.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
  })
  const response = await api.patch(`/institutional-events`, dto);
  queryClient.invalidateQueries('events');

  return response.data;
}

export const useHandleEventLike = () => {
  const mutation = useMutation(['useHandleEventLike'], handleEventLike);

  return mutation;
}
