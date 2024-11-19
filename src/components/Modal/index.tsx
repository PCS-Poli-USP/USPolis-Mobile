import { Theme } from '@/theme/theme'
import { useTheme } from '@shopify/restyle'
import React from 'react'
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
      avoidKeyboard
      onBackButtonPress={() => onClose(false)}
    >
      {children}
    </ModalComponent>
  )
}
