import { Theme } from '@/theme/theme'
import { useTheme } from '@shopify/restyle'
import { Box, Typography, VStack } from '../ui'
import ModalComponent from 'react-native-modal'
import React, { ReactNode } from 'react'

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    children: ReactNode;
}

export const AlertModal = ({
    isOpen,
    onClose,
    title,
    message,
    children,
}: AlertModalProps) => {
    const { colors } = useTheme<Theme>()

    return (
        <Box flex={1}>
            <ModalComponent
                propagateSwipe
                isVisible={isOpen}
                backdropColor={colors.grayOne}
                backdropOpacity={0.2}
                swipeDirection={['up', 'down', 'left', 'right']}
                onBackdropPress={() => onClose()}
                onSwipeComplete={() => onClose()}
                coverScreen
                onBackButtonPress={() => onClose()}
                style={{ margin: 10 }} >

                <Box
                    width={'100%'}
                    borderTopLeftRadius={8}
                    borderTopRightRadius={8}
                    borderBottomLeftRadius={8}
                    borderBottomRightRadius={8}
                    backgroundColor="grayFive"
                    paddingHorizontal={'s'}
                    paddingVertical="l" >
                    <Box backgroundColor="grayFive" borderBottomColor="transparent" marginBottom={'m'}>
                        <VStack alignItems="center" marginBottom={'m'}>
                            <Typography
                                variant={'heading'}
                                color="white"
                                fontSize={20}
                                marginBottom={'m'} >
                                {title}
                            </Typography>
                            <Typography color="grayTwo" fontSize={14}>
                                {message}
                            </Typography>
                        </VStack>
                    </Box>
                    {children}
                </Box>
            </ModalComponent>

        </Box>

    )
}