import { Box, Button, Pressable, Typography, VStack, HStack } from "@/components";
import { ForumModal } from "@/components/ForumModal";
import { PostRequest } from "@/dtos/forum";
import { useCreatePost, usePosts } from "@/hooks/react-query/usePosts";
import { useGoogleAuthContext } from "@/hooks/useAuth";
import { StackRoutesType } from "@/routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { logger } from "@/services/logger";
import { RouteProp, useRoute, } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { Dimensions, ScrollView } from 'react-native'
import { IClass } from "@/dtos";

export type Post = {
    id: number;
    author: string;
    body: string;
    createdAt: string;
};

export function Forum() {
    const { params } = useRoute<RouteProp<StackRoutesType, "Forum">>();
    const [isForumModalOpen, setIsForumModalOpen] = useState<boolean>(false);
    const { data: fetchedPosts, isLoading: isLoadingPosts } = usePosts(params.sclass!);
    const handlePost = useCreatePost();
    const [posts, setPosts] = useState<Post[]>([]);
    const { authUser, isLoggedIn, getUserToken } = useGoogleAuthContext()

    const { width, height } = Dimensions.get('window');
    const screenWidth = width
    const screenHeight = height


    useEffect(() => {
        if (fetchedPosts) {
            console.log("Atualizou os posts, total:", fetchedPosts.length);
            setPosts(fetchedPosts.map((post) => {
                return {
                    id: post.id,
                    author: post.user_name,
                    body: post.content,
                    createdAt: post.created_at
                };
            }));
        }
    }, [fetchedPosts]);

    async function handleAddNewPost(body: string) {
        if (authUser) {
            const newPostDTO: PostRequest = {
                user_id: authUser.id,
                content: body,
                class_id: params.sclass!.id,
                subject_id: params.sclass!.subject_id
            };
            const newPost = await handlePost(newPostDTO);
            setPosts([
                ...posts,
                {
                    id: newPost.id,
                    author: newPost.user_name,
                    body: newPost.content,
                    createdAt: newPost.created_at,
                }
            ]);
            logger.logEvent("Novo post no forum", {user_id: authUser.id, subject: params.sclass?.subject_code});
        } else {
            Toast.show({
                type: 'error',
                text1: 'Ops!',
                text2: 'É preciso logar para postar!'
            });
        }
    }
    const openForumModal = () => {
        //logger.logEvent("Clicou para abrir o forum da class:", params.sclass);
        setIsForumModalOpen(true);
    }

    return (
        <VStack flex={1} width={screenWidth} >

            <Box 
                backgroundColor="graySix"
                paddingHorizontal="s"
                paddingVertical="m"
                marginTop="s"
                alignItems="center"
                borderRadius={5}
            >
                <Typography color="grayOne" fontSize={18} >
                    BEM VINDO AO FÓRUM DE {params.sclass?.subject_code}!
                </Typography>
                <Typography color="grayOne" fontSize={14} paddingTop="s">
                    Tenha educação e respeito com os outros 😊
                </Typography>

            </Box>
            <Box
                backgroundColor="transparent"
                paddingHorizontal="m"
                paddingVertical="m"
                marginTop="s"
                alignItems="center"
                height={screenHeight - 300}
            >
                {posts?.length === 0 ?
                    <Box alignContent="center">
                        <Typography color="grayOne" fontSize={16}>
                            Ainda ninguém postou neste fórum 😞 {"\n"}
                            Seja o primeiro a postar!
                        </Typography>
                    </Box>
                    :
                    <ScrollView>
                        <VStack>
                            <Box width={screenWidth * 0.95}>
                                {posts.map((post, index) => {
                                    return <MemoPost key={index} post={post} sclass={params.sclass} />
                                })}
                            </Box>
                        </VStack>

                    </ScrollView>
                }

            </Box>
            <Box
                backgroundColor="transparent"

                paddingHorizontal="m"
                position="absolute"
                bottom={30}
                alignItems="center"
                width={screenWidth}
            >
                <Button
                    variant="outlined"
                    title={"Postar no fórum de " + params.sclass?.subject_code}
                    onPress={() => { openForumModal(); }}
                    style={{ height: 80 }}
                />
            </Box>

            {isForumModalOpen && <Box flex={1}>
                <ForumModal
                    sclass={params.sclass}
                    isOpen={isForumModalOpen}
                    onClose={() => setIsForumModalOpen(false)}
                    onHandleNewPost={handleAddNewPost} />
            </Box>}

        </VStack>
    );
}

type PostCardProps = {
    post: Post;
    sclass: IClass | undefined
}
function PostCard({ post, sclass }: PostCardProps) {
    const navigationStack = useNavigation<NavigationProp<StackRoutesType>>()

    const selectPost = () => {
        navigationStack.navigate('ForumContent',
            { post, sclass }
        )

    }
    const formatDatetime = (datetime: string) => {
        const date = new Date(datetime);

        const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', day: 'numeric' });

        return formatter.format(date);
    }


    return (
        <Pressable onPress={selectPost}>
            <HStack
                alignItems="center"
                backgroundColor={"grayFive"}
                borderRadius={8}
                padding="m"
                marginBottom="s"
            >
                <VStack flex={1} marginRight={"xs"}>
                    <Typography
                        marginBottom={"s"}
                        fontSize={16}
                        color="white"
                        variant={"heading"} >{post.body}</Typography>
                    <HStack>
                        <Typography
                            color="grayOne"
                            paddingRight={"xxs"}
                            numberOfLines={2}
                        >
                            {post.author}
                        </Typography>
                        <Typography
                            color="grayOne"
                            numberOfLines={2}
                            variant="heading"
                        >
                            {formatDatetime(post.createdAt)}
                        </Typography>
                    </HStack>
                </VStack>
            </HStack>
        </Pressable>
    );
}
const MemoPost = React.memo(PostCard);
