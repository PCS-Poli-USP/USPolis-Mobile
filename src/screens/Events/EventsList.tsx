import React, { useEffect, useState } from 'react'
import { Box, HStack, Typography, VStack } from '@/components'
import FeatherIcons from '@expo/vector-icons/Feather'
import { ActivityIndicator, Alert, Linking, Pressable } from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '@/theme/theme'
import { getFilteredEvents } from './utils'
import { logger } from '@/services/logger'
import { useEvents } from '@/hooks/react-query/useEvents'
import { IEvent } from '@/dtos/events'
import { EventModal } from './EventDrawer'

interface EventsListProps {
  buildingFilter: string
  nameFilter?: string
}

export const EventsList = ({ buildingFilter, nameFilter }: EventsListProps) => {
  const { data: events, isLoading: isLoadingEvents } = useEvents()

  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([])

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    const cancelTimeout = setTimeout(() => {
      const filteredEvents = getFilteredEvents({
        events: events || [],
        buildingFilter,
        nameFilter: nameFilter || '',
      })

      setFilteredEvents(filteredEvents)
      setIsLoading(false)
    }, 2)

    return () => {
      clearTimeout(cancelTimeout)
    }
  }, [events, nameFilter, buildingFilter])

  return (
    <VStack>
      <HStack flex={1} justifyContent={'space-between'} marginBottom={'xs'}>
        <Typography color="grayTwo" fontWeight={'bold'}>
          Aulas
        </Typography>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Typography color="grayTwo">{filteredEvents?.length}</Typography>
        )}
      </HStack>

      {/* Todo: return skeleton loading */}
      {(isLoading || isLoadingEvents) && <ActivityIndicator />}
      {!isLoadingEvents &&
        !isLoading &&
        filteredEvents.map((item, index) => (
          <MemoEventCard event={item} key={`${item._id}-${index}`} />
        ))}
    </VStack>
  )
}

interface EventCardProps {
  event: IEvent
}

export const EventCard = ({ event }: EventCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { colors } = useTheme<Theme>()

  const selectEvent = () => {
    setIsModalOpen(true)
    logger.logEvent('Aula Visualizada', {
      class: event.title,
      screen: 'Home',
      id: event._id,
    })
  }

  return (
    <>
      <Pressable onPress={selectEvent}>
        <HStack
          alignItems="center"
          backgroundColor={'grayFive'}
          borderRadius={8}
          padding="m"
          marginBottom="s"
        >
          <VStack flex={1} marginRight={'xs'}>
            <Typography
              marginBottom={'xxs'}
              fontSize={18}
              color="white"
              variant={'heading'}
              fontWeight="bold"
              numberOfLines={1}
            >
              {event.title}
            </Typography>

            <Typography color="grayTwo" marginBottom={'xxs'} numberOfLines={2}>
              {event.description}
            </Typography>
            <Typography color="grayOne" numberOfLines={2} variant="heading">
              {event.location}
            </Typography>
            {event.external_link && (
              <>
                <Box mb="l" />
                <Pressable
                  onPress={async () => {
                    const supported = await Linking.canOpenURL(
                      event.external_link,
                    )
                    if (supported) {
                      await Linking.openURL(event.external_link)
                    } else {
                      Alert.alert(
                        `Não foi possível abrir URL no dispositivo: ${event.external_link}`,
                      )
                    }
                  }}
                >
                  <Typography
                    color="primary"
                    numberOfLines={2}
                    variant="heading"
                  >
                    Saiba mais
                  </Typography>
                </Pressable>
              </>
            )}
          </VStack>
          <FeatherIcons
            name="chevron-right"
            color={colors.grayThree}
            size={24}
          />
        </HStack>
      </Pressable>
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
      />
    </>
  )
}

const MemoEventCard = React.memo(EventCard)
