import React from 'react'
import { Button } from '../Button'
import { IClass } from '../../dtos/classes'
import { Box, HStack, Typography } from "../ui";
import { Modal } from '../Modal'
import { Input } from '../Input'
import { Dimensions} from 'react-native'
import { useGoogleAuthContext } from "@/hooks/useAuth";
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { StackRoutesType } from "@/routes";
import { Post } from '@/screens/Forum/Forum';



interface ForumPostReplyModalProps {
	post?: Post | null
	isOpen: boolean
	onClose: () => void
	onHandleNewPostReply: (body: string) => void;
}

export const ForumPostReplyModal = ({
	post,
	isOpen,
	onClose,
	onHandleNewPostReply
}: ForumPostReplyModalProps 
) => {
	const { isLoggedIn } = useGoogleAuthContext()

	let postText = "";
    const { height } = Dimensions.get('window');
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
					paddingVertical="xl"
				>
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
									'Responder postagem'
								}
								onPress={() => {
									if (postText) {
										onHandleNewPostReply(postText)
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
							
							<Typography color="grayTwo" fontSize={16}>É preciso estar logado para responder no fórum!</Typography>
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