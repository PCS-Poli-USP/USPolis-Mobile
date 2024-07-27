import { Button } from '../Button'
import { IClass } from '../../dtos/classes'
import { Box, Typography, VStack } from '../ui'
import { Modal } from '../Modal'
import { Input } from '../Input'

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
	let postText = "";

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
					<Input
						variation="secondary"
						placeholder={'Escreva algo para postar!'}
						onChangeText={(text) => postText = text}
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
			</Modal>

		</Box>

	)


}