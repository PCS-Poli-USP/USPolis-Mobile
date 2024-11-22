import React, { useState } from "react"
import { Button } from "../Button"
import { IClass } from "../../dtos/classes"
import { Box, Typography, VStack } from "../ui";
import { Modal } from "../Modal"
import { Input } from "../Input"
import { Dimensions } from "react-native"
import { useGoogleAuthContext } from "@/hooks/useAuth";
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { StackRoutesType } from "@/routes";
import { ForumPostsFilter } from "../ForumPostsFilter/ForumPostsFilter";
import { PostTag } from "@/dtos/forum";

interface ForumModalProps {
	sclass?: IClass | null;
	isOpen: boolean;
	isGeneralForum: boolean;
	onClose: () => void;
	onHandleNewPost: (body: string, tags: PostTag[]) => void;
};

export const ForumModal = ({
	sclass,
	isOpen,
	isGeneralForum,
	onClose,
	onHandleNewPost
}: ForumModalProps) => {
	const [activeFilters, setActiveFilters] = useState<PostTag[]>([]);
	const { isLoggedIn } = useGoogleAuthContext();

	const [postContentText, setPostContentText] = useState("");
	const { width, height } = Dimensions.get("window");
	const screenWidth = width;
	const screenHeight = height;

	const navigationStack = useNavigation<NavigationProp<StackRoutesType>>();

	const navigateToProfile = () => {
		onClose()
		navigationStack.navigate("UserProfile")
	};

	function selectedFilterTag(postFilterTag: PostTag, isActive: boolean): void {
		let newFilters
		if (isActive) {
			newFilters = activeFilters.filter((e) => { return postFilterTag.name != e.name });
			setActiveFilters(newFilters);
		} else {
			newFilters = [...activeFilters, postFilterTag]
			setActiveFilters(newFilters);
		}
	}

	return (
		<Box flex={1}>
			<Modal
				isOpen={isOpen}
				onClose={onClose}>
				<Box
					width={"100%"}
					borderTopLeftRadius={8}
					borderTopRightRadius={8}
					backgroundColor="grayFive"
					position="absolute"
					bottom={0}
					paddingHorizontal={"s"}
					paddingVertical="l"
				>
					<Box backgroundColor="grayFive" borderBottomColor="transparent" marginBottom={"m"}>
						<VStack alignItems="center" marginBottom={"m"}>
							{isGeneralForum ?
								<Typography
									variant={"heading"}
									color="white"
									fontSize={20}
									marginBottom={"xxs"}>
									Fórum Geral
								</Typography>
								:
								<>
									<Typography
										variant={"heading"}
										color="white"
										fontSize={20}
										marginBottom={"s"}>
										{sclass!.subject_code}
									</Typography>
									<Typography
										variant={"heading"}
										color="white"
										fontSize={18}
										marginBottom={"s"}>
										{sclass!.subject_name}
									</Typography>
									<Typography color="grayTwo" fontSize={14}>
										Turma {sclass!.code.substring(sclass!.code.length - 2)}
									</Typography>
								</>}
						</VStack>
					</Box>
					{isLoggedIn ?
						<Box>
							<Input
								maxLength={240}
								multiline={true}
								height={screenHeight * 0.15}
								variation="secondary"
								placeholder={"Escreva algo para postar!"}
								onChangeText={(text) => setPostContentText(text)}
								textAlignVertical="top"
								padding="s"
							/>

							<Box backgroundColor="grayFour" borderRadius={10} padding="s" marginBottom="s">
								<Typography
									color="grayTwo"
									fontSize={16}
									variant="heading">
									Adicionar Tag ao post{"\n"}
								</Typography>
								<ForumPostsFilter
									myProperty="xxs"
									activeFilters={activeFilters}
									filterPosts={selectedFilterTag} />
							</Box>

							<Button
								variant={"outlined"}
								title={
									"Criar postagem"
								}
								onPress={() => {
									if (postContentText) {
										onHandleNewPost(postContentText, activeFilters)
										onClose();
									}
								}}
							/>
						</Box>
						:
						<Box
							alignItems="center"
							marginBottom={"m"}
							backgroundColor="grayFour"
							borderRadius={10}
							padding="m"
							borderColor="graySeven"
						>

							<Typography color="grayTwo" fontSize={16}>É preciso estar logado para postar no fórum!</Typography>
							<Box paddingVertical="m" width={"80%"}>
								<Button
									title="Ir para a tela de login"
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