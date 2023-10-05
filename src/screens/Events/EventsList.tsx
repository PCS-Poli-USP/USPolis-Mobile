import React, { useEffect, useState } from 'react'
import { Box, HStack, Typography, VStack } from '@/components'
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '@/theme/theme'
import { getFilteredEvents } from './utils'
import { logger } from '@/services/logger'
import { useEvents } from '@/hooks/react-query/useEvents'
import { IEvent } from '@/dtos/events'
import { EventModal } from './EventDrawer'
import FeatherIcons from '@expo/vector-icons/Feather'
import { useLikeStore } from '@/store/likes-store'
import { useHandleLike } from '@/hooks/react-query/mutations/useHandleLike'
import { useHandleRemoveLike } from '@/hooks/react-query/mutations/useHandleRemoveLike'
import { AxiosError } from 'axios'

interface EventsListProps {
  buildingFilter: string
  nameFilter?: string
}

export const EventsList = ({ buildingFilter, nameFilter }: EventsListProps) => {
  const { data: events, isLoading: isLoadingEvents } = useEvents()
  console.log('isLoadingEvents', isLoadingEvents)
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
          Eventos
        </Typography>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Typography color="grayTwo">{filteredEvents?.length}</Typography>
        )}
      </HStack>

      {/* Todo: return skeleton loading */}
      {isLoadingEvents && <ActivityIndicator />}
      {!isLoadingEvents &&
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
  const { mutateAsync: handleLike } = useHandleLike()
  const { mutateAsync: handleRemove } = useHandleRemoveLike()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { colors } = useTheme<Theme>()

  const { isLiked, like, removeLike } = useLikeStore((state) => ({
    isLiked: state.likes?.[event._id],
    like: () => state.like(event._id),
    removeLike: () => state.removeLike(event._id),
  }))

  const selectEvent = () => {
    setIsModalOpen(true)
    logger.logEvent('Evento Visualizado', {
      class: event.title,
      screen: 'Home',
      id: event._id,
    })
  }

  const handleInteractWithLike = async () => {
    try {
      if (isLiked) {
        logger.logEvent('Aula Descurtida', {
          class: event.title,
          id: event._id,
        })
        await handleRemove(event._id)
        removeLike()
      } else {
        logger.logEvent('Aula Curtida', {
          class: event.title,
          id: event._id,
        })
        await handleLike(event._id)
        like()
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log('err', err.response?.data)
      }
    }
  }

  return (
    <>
      <Pressable onPress={selectEvent}>
        <VStack position="relative">
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

              <Typography
                color="grayTwo"
                marginBottom={'xxs'}
                numberOfLines={2}
              >
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
            <VStack
              alignItems="center"
              justifyContent="space-between"
              flexDirection="column"
            >
              <FeatherIcons
                name="chevron-right"
                color={colors.grayThree}
                size={24}
                style={{
                  marginBottom: 32,
                }}
              />
              <TouchableOpacity onPress={handleInteractWithLike}>
                <HStack flexDirection="row" alignItems="center">
                  <Box position="absolute" right={'100%'} top={4}>
                    <Typography
                      color={isLiked ? 'primary' : 'grayTwo'}
                      variant="heading"
                      marginRight={'xs'}
                    >
                      {event.likes}
                    </Typography>
                  </Box>
                  <FeatherIcons
                    name="thumbs-up"
                    color={isLiked ? colors.primary : colors.grayTwo}
                    size={20}
                  />
                </HStack>
              </TouchableOpacity>
            </VStack>
          </HStack>
        </VStack>
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
