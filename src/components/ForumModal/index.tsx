import { useSchedule } from '@/hooks/useSchedule'
import { AppRoutesType } from '@/routes/app.routes'
import FeatherIcons from '@expo/vector-icons/Feather'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { differenceInDays, format, parseISO } from 'date-fns'
import { Pressable } from 'react-native'
import { Button } from '../Button'
import { sortEventsByScheduleTime } from './utils'
import { Building, IClass } from '../../dtos/classes'
import { Theme } from '@/theme/theme'
import { useTheme } from '@shopify/restyle'
import { Box, HStack, Typography, VStack } from '../ui'
import { logger } from '@/services/logger'
import { Modal } from '../Modal'

interface ForumModalProps {
  sclass?: IClass | null
  isOpen: boolean
  onClose: () => void
}


export const ForumModal = ({
    sclass,
    isOpen,
    onClose,
}: ForumModalProps) => {

	const dict = [
		{
			title : 'Title1',
			text : 'aashdfuiashbfipuahsiufhusahfouhasoui'
		},
		{
			title : 'Title2',
			text : 'aashdfuiashbfipuahsiufhusahfouhasoui'
		}	
	]

    return(
        <Box flex={1}>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<Box 
					
					width={'100%'}
					borderTopLeftRadius={8}
					borderTopRightRadius={8}
					backgroundColor="grayFive"
					position="absolute"
					bottom={0}
					paddingHorizontal={'s'}
					paddingVertical="l"
				>
					<Box backgroundColor="grayFive" borderBottomColor="transparent" marginBottom={'m'}>
						<VStack alignItems="center" marginBottom={'m'}>
						<Typography
							variant={'heading'}
							color="white"
							fontSize={20}
							marginBottom={'s'}
						>
							{sclass.subject_code}
						</Typography>
						<Typography
							variant={'heading'}
							color="white"
							fontSize={18}
							marginBottom={'s'}
						>
							{sclass.subject_name}
						</Typography>
						<Typography color="grayTwo" fontSize={14}>
							Turma {sclass.class_code.slice(-2)}
						</Typography>
						</VStack>
					</Box>
					{/* {dict.forEach((title, index) => (
						TODO: Uma lógica para os tópicos
					) 
					)} */}
					<Typography color="grayTwo" fontSize={14}>
                		Turma
             		</Typography>
					<Button
						variant={'outlined'}
						title={
							'Criar tópico'
						}
						onPress={() =>
							onClose()
						}
					/>
				</Box>
			</Modal>

		</Box>

    )


}