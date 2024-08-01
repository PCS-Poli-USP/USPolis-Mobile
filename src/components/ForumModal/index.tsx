import React from 'react'
import { Button } from '../Button'
import { IClass } from '../../dtos/classes'
import { Box, HStack, Typography, VStack } from "../ui";
import { Modal } from '../Modal'
import { Input } from '../Input'
import { Dimensions, ScrollView } from 'react-native'
import { useGoogleAuthContext } from "@/hooks/useAuth";
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { StackRoutesType } from "@/routes";



interface ForumModalProps {
	sclass?: IClass | null
	isOpen: boolean
	onClose: () => void
	onHandleNewPost: (body: string) => void;
}

export const ForumModal = ({
	sclass,
	isOpen,
	onClose,
	onHandleNewPost
}: ForumModalProps) => {
	const { isLoggedIn } = useGoogleAuthContext()

	let postText = "";
    const { width, height } = Dimensions.get('window');
    const screenWidth = width
    const screenHeight = height

	const navigationStack = useNavigation<NavigationProp<StackRoutesType>>()

	const navigateToProfile = () => {
		onClose()
	  	navigationStack.navigate("UserProfile")
	}

	return (
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
								{sclass!.subject_code}
							</Typography>
							<Typography
								variant={'heading'}
								color="white"
								fontSize={18}
								marginBottom={'s'}
							>
								{sclass!.subject_name}
							</Typography>
							<Typography color="grayTwo" fontSize={14}>
								Turma {sclass!.code}
							</Typography>
						</VStack>
					</Box>
					{isLoggedIn? 
						<Box>
							<Input
								maxLength={240}
								multiline={true}
								height={screenHeight*0.15}
								variation="secondary"
								placeholder={'Escreva algo para postar!'}
								onChangeText={(text) => postText = text}
								textAlignVertical='top'
								padding='s'								
							/>
							
							<Button
								variant={'outlined'}
								title={
									'Criar postagem'
								}
								onPress={() => {
									if (postText) {
										onHandleNewPost(postText)
										onClose();
									}
								}}
							/>
						</Box>
					:
						<Box 
							alignItems="center" 
							marginBottom={'m'} 
							backgroundColor='grayFour' 
							borderRadius={10}
							padding='m'
							borderColor='graySeven'
						>
							
							<Typography color="grayTwo" fontSize={16}>É preciso estar logado para postar no fórum!</Typography>
							<Box paddingVertical='m' width={'80%'}>
								<Button
									title='Ir para a tela de login'
									onTouchEnd={navigateToProfile}
								/>
							</Box>
						</Box>
					
					}
				</Box>
			</Modal>

		</Box>

	)


}