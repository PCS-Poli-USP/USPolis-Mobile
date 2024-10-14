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
import { type EventLikeDTO, IEvent } from '@/dtos/events'
import { EventModal } from './EventDrawer'
import FeatherIcons from '@expo/vector-icons/Feather'
import { useLikeStore } from '@/store/likes-store'
import { AxiosError } from 'axios'
import { useGoogleAuthContext } from '@/hooks/useAuth'
import { useHandleEventLike } from '@/hooks/react-query/mutations/useHandleEventLike'

interface EventsListProps {
  buildingFilter: string
  nameFilter?: string
}

export const EventsList = ({ buildingFilter, nameFilter }: EventsListProps) => {
  const { data: events, isLoading: isLoadingEvents } = useEvents()
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([])

  const [isLoading, setIsLoading] = useState(false)

  const { isLoggedIn, silentlyLogin } = useGoogleAuthContext()

  useEffect(() => {
    if (!isLoggedIn) {
      silentlyLogin()
    }
  }, [])

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
          <MemoEventCard event={item} key={`${item.id}-${index}`} />
        ))}
    </VStack>
  )
}

interface EventCardProps {
  event: IEvent
}

export const EventCard = ({ event }: EventCardProps) => {
  const { mutateAsync: handleEventLike } = useHandleEventLike()

  const { authUser } = useGoogleAuthContext()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { colors } = useTheme<Theme>()

  const { isLiked, like, removeLike } = useLikeStore((state) => ({
    isLiked: state.likes?.[event.id],
    like: () => state.like(event.id),
    removeLike: () => state.removeLike(event.id),
  }))

  const selectEvent = () => {
    setIsModalOpen(true)
    logger.logEvent('Evento Visualizado', {
      class: event.title,
      screen: 'Home',
      id: event.id,
    })
  }

  const handleInteractWithLike = async () => {
    try {
      const dto: EventLikeDTO = {
        event_id: event.id,
        user_id: authUser?.id ? authUser.id : -1,
        like: true
      };
      if (isLiked) {
        logger.logEvent('Aula Descurtida', {
          class: event.title,
          id: event.id,
        });
        dto.like = false;
        await handleEventLike(dto)
        removeLike()
      } else {
        logger.logEvent('Aula Curtida', {
          class: event.title,
          id: event.id,
        });
        dto.like = true;
        await handleEventLike(dto)
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
              // numberOfLines={1}
              >
                {event.title}
              </Typography>

              <Typography color="grayTwo" marginBottom={'xs'} numberOfLines={2}>
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
