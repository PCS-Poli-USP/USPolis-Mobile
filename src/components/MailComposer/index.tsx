import { TouchableOpacity } from 'react-native'
import { Box, Typography } from '../ui'
import * as Mail from 'expo-mail-composer'
import { useRef, useState } from 'react'
import Modal from 'react-native-modal'
import { Theme } from '@/theme/theme'
import { useTheme } from '@shopify/restyle'
import { Button } from '../Button'
import * as Clipboard from 'expo-clipboard'

export const MailComposer = () => {
  const { colors } = useTheme<Theme>()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const cancelTimeout = useRef<any>(null)

  return (
    <>
      <TouchableOpacity
        onPress={async () => {
          try {
            const success = await Mail.composeAsync({
              recipients: ['uspolis@usp.br'],
              subject: 'Desejo adicionar um evento',
              body: 'Olá, gostaria de adicionar um evento',
            })
            console.log('success', success)
            if (!success) {
              setIsDrawerOpen(true)
            }
          } catch (err) {
            setIsDrawerOpen(true)
          }
        }}
      >
        <Typography textAlign="center" color="grayTwo">
          Deseja adicionar um evento?
        </Typography>
        <Typography textAlign="center" color="primary" marginTop="s">
          Fale Conosco
        </Typography>
      </TouchableOpacity>
      <Modal
        isVisible={isDrawerOpen}
        backdropColor={colors.grayOne}
        backdropOpacity={0.2}
        swipeDirection={'down'}
        onBackdropPress={() => setIsDrawerOpen(false)}
        onSwipeComplete={() => setIsDrawerOpen(false)}
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
          <Typography
            variant="heading"
            fontSize={16}
            textAlign="center"
            marginBottom="s"
            color="white"
          >
            Solicitação de Eventos
          </Typography>
          <Box mb="m" />
          <Typography textAlign="center" marginBottom="s" color="grayTwo">
            Para solicitar adição de novos eventos, envie um e-mail para:
          </Typography>
          <Box mb="s" />
          <Typography textAlign="center" marginBottom="s" color="white">
            uspolis@usp.br
          </Typography>
          <Box mb="s" />
          <Button
            title={isCopied ? 'Copiado!' : 'Copiar e-mail'}
            variant={isCopied ? 'outlined' : 'primary'}
            onPress={async () => {
              await Clipboard.setStringAsync('uspolis@usp.br')
              setIsCopied(true)
              cancelTimeout.current = setTimeout(() => {
                setIsCopied(false)
              }, 3000)
            }}
          />
          <Box mb="s" />
          <Button title="Fechar" variant="raw" />
        </Box>
      </Modal>
    </>
  )
}
