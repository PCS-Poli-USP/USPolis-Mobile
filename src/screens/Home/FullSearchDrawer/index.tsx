import { Theme } from '@/theme/theme'
import { useTheme } from '@shopify/restyle'
import { Box } from '@/components'
import React from 'react'
import { CourseSearch } from './CourseSearch'
import { useFullSearch } from './context'
import { ClassSelection } from './ClassSelection'
import { Modal } from '@/components/Modal'

interface IFullSearchDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const ClassFullSearchDrawer = ({
  isOpen,
  onClose,
}: IFullSearchDrawerProps) => {
  const { colors } = useTheme<Theme>()
  const { index } = useFullSearch()

  return (
    <Box flex={1}>
      <Modal isOpen={isOpen} onClose={onClose}>
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
          {index === 0 && <CourseSearch />}

          {index === 1 && <ClassSelection onClose={onClose} />}
        </Box>
      </Modal>
    </Box>
  )
}
