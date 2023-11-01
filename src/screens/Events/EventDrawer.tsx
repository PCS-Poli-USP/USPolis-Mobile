import FeatherIcons from '@expo/vector-icons/Feather'
import { format, parseISO } from 'date-fns'
import { Alert, Linking, Pressable } from 'react-native'
import { Theme } from '@/theme/theme'
import { useTheme } from '@shopify/restyle'
import Modal from 'react-native-modal'
import { Box, HStack, Typography, VStack } from '@/components'
import { IEvent } from '@/dtos/events'
import dayjs from 'dayjs'

interface EventModalProps {
  event?: IEvent | null
  isOpen: boolean
  onClose: () => void
}

export const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  const { colors } = useTheme<Theme>()

  if (!event) return <></>

  const navigateToExternalLink = async () => {
    const supported = await Linking.canOpenURL(event.external_link)
    if (supported) {
      await Linking.openURL(event.external_link)
    } else {
      Alert.alert(
        `Não foi possível abrir URL no dispositivo: ${event.external_link}`,
      )
    }
    onClose()
  }
  console.log(event)
  console.log(dayjs(event.end_datetime).format('YYYY-MM-DD HH:mm'))

  return (
    <Box flex={1}>
      <Modal
        isVisible={isOpen}
        backdropColor={colors.grayOne}
        backdropOpacity={0.2}
        swipeDirection={'down'}
        onBackdropPress={onClose}
        onSwipeComplete={onClose}
        coverScreen
        style={{ margin: 0 }}
      >
        <Box
          width={'100%'}
          borderTopLeftRadius={8}
          borderTopRightRadius={8}
          backgroundColor="graySeven"
          position="absolute"
          bottom={0}
          paddingHorizontal={'s'}
          paddingVertical="l"
        >
          <Box backgroundColor="graySeven" borderBottomColor="transparent">
            <VStack alignItems="center" marginBottom={'m'}>
              <Typography
                variant={'heading'}
                color="white"
                fontSize={20}
                marginBottom={'s'}
              >
                {event.title}
              </Typography>
              <Typography color="grayTwo" fontSize={14}>
                {event.location}
              </Typography>
            </VStack>
          </Box>
          <Box
            backgroundColor="graySeven"
            paddingHorizontal={'m'}
            paddingBottom={'s'}
          >
            <VStack backgroundColor="graySeven" marginBottom="m">
              {event.external_link && (
                <Box key={`${event._id}-${event.title}`} marginBottom={'s'}>
                  <Pressable onPress={navigateToExternalLink}>
                    <Box
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      backgroundColor="grayFive"
                      borderRadius={8}
                      padding={'l'}
                    >
                      <VStack gap={'xs'}>
                        <Typography color="white">
                          Obtenha mais informações
                        </Typography>
                      </VStack>
                      <HStack alignItems={'center'}>
                        <Typography color={'primary'} marginRight="s">
                          Ver mais
                        </Typography>
                        <FeatherIcons
                          name="chevron-right"
                          color={colors.primary}
                          size={15}
                        />
                      </HStack>
                    </Box>
                  </Pressable>
                </Box>
              )}
              {!!event.description && (
                <Box marginBottom="m" marginTop="m">
                  <Typography color="white" fontSize={16}>
                    {event.description}
                  </Typography>
                </Box>
              )}
              {!!event.category && (
                <Box marginBottom="m">
                  <Typography color="grayTwo">Categoria</Typography>
                  <Typography color="white">{event.category}</Typography>
                </Box>
              )}
              {!!event.category && (
                <Box marginBottom="m">
                  {event.classroom && (
                    <Typography color="grayTwo">{event.classroom}</Typography>
                  )}
                  {event.building && (
                    <Typography color="white">{event.building}</Typography>
                  )}
                </Box>
              )}
              <Box marginBottom="m">
                <Box flexDirection="row" justifyContent="space-between">
                  {!!event.start_datetime && (
                    <Box>
                      <Typography color="grayTwo">Início</Typography>
                      <Typography color="white">
                        {dayjs(event.start_datetime).format('DD/MM/YYYY HH:mm')}
                      </Typography>
                    </Box>
                  )}
                  {!!event.end_datetime && (
                    <Box>
                      <Typography color="grayTwo">Fim</Typography>
                      <Typography color="white">
                        {dayjs(event.end_datetime).format('DD/MM/YYYY HH:mm')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}
