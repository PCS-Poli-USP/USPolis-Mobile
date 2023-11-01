import { IEvent } from '@/dtos/events'
import { replaceSpecialCharacters } from '@/utils/string'

interface GetFilteredEventsProps {
  events: IEvent[]
  nameFilter: string
  buildingFilter: string
}

export const getFilteredEvents = ({
  events,
  nameFilter,
  buildingFilter,
}: GetFilteredEventsProps) => {
  if (!events) return []

  let eventsFiltered = [...events]
  if (nameFilter) {
    eventsFiltered = eventsFiltered?.filter(
      (c) =>
        replaceSpecialCharacters(c.building?.toLowerCase() || '').includes(
          replaceSpecialCharacters(nameFilter.toLowerCase()),
        ) ||
        replaceSpecialCharacters(
          (c.category.toLowerCase() || '').toLowerCase(),
        ).includes(replaceSpecialCharacters(nameFilter.toLowerCase())) ||
        replaceSpecialCharacters(c.classroom?.toLowerCase() || '').includes(
          replaceSpecialCharacters(nameFilter.toLowerCase()),
        ) ||
        replaceSpecialCharacters(c.title?.toLowerCase() || '').includes(
          replaceSpecialCharacters(nameFilter.toLowerCase()),
        ) ||
        replaceSpecialCharacters(c.location?.toLowerCase() || '').includes(
          replaceSpecialCharacters(nameFilter.toLowerCase()),
        ),
    )
  }

  if (buildingFilter) {
    eventsFiltered = eventsFiltered?.filter((c) => {
      return c.building?.includes(buildingFilter)
    })
  }

  return eventsFiltered
}
