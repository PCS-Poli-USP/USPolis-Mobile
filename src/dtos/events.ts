export interface IEvent {
  _id: string
  building: string | null
  category: string
  classroom: string | null
  created_at: string
  description: string
  end_timestamp: string
  external_link: string
  location: string
  start_timestamp: string
  title: string
  likes: number
}
