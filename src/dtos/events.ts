export interface IEvent {
  id: number
  title: string
  description: string
  category: string
  end_datetime: string
  start_datetime: string
  location: string
  building: string | null
  classroom: string | null
  created_at: string
  external_link: string
  likes: number
}

export type EventLikeDTO = {
  event_id: number
  user_id: number
  like: boolean
}
