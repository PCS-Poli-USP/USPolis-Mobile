import { Theme } from '@/theme/theme'
import { useTheme } from '@shopify/restyle'
import { useEffect } from 'react'
import { BackHandler } from 'react-native'
import ModalComponent from 'react-native-modal'

export const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: (isOpen: boolean) => void
  children: React.ReactNode
}) => {
  const { colors } = useTheme<Theme>()

  useEffect(() => {
    const backAction = () => {
      onClose(false)
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [])

  return (
    <ModalComponent
      propagateSwipe
      isVisible={isOpen}
      backdropColor={colors.grayOne}
      backdropOpacity={0.2}
      swipeDirection={'down'}
      onBackdropPress={() => onClose(false)}
      onSwipeComplete={() => onClose(false)}
      coverScreen
      style={{ margin: 0 }}
    >
      {children}
    </ModalComponent>
  )
}
