import { Theme } from "@/theme/theme";
import { useTheme } from "@shopify/restyle";
import Modal from 'react-native-modal';
import { logger } from "@/services/logger";
import { Box, Button, Dropdown, Typography, VStack } from "@/components";
import React, { useMemo } from "react";
import { CourseSearch } from "./CourseSearch";
import { FullSearchContextProvider, useFullSearch } from "./context";
import { ClassSelection } from "./ClassSelection";

interface IFullSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassFullSearchDrawer = ({
  isOpen,
  onClose,
}: IFullSearchDrawerProps) => {
  const { colors } = useTheme<Theme>();
  const { index } = useFullSearch()

  return (
    <Box flex={1}>
      <Modal
        isVisible={isOpen}
        backdropColor={colors.grayOne}
        backdropOpacity={0.2}
        onBackdropPress={onClose}
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
          {index === 0 && (
            <CourseSearch />
          )}

          {index === 1 && (
            <ClassSelection onClose={onClose} />
          )}
        </Box>
      </Modal>
    </Box>
  )
}