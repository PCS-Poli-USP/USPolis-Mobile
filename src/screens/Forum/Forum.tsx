import { Box, Button, Pressable, Typography, VStack, HStack } from "@/components";
import { ForumModal } from "@/components/ForumModal";
import { PostRequest, PostResponse } from "@/dtos/forum";
import { useCreatePost, usePosts } from "@/hooks/react-query/usePosts";
import { useGoogleAuthContext } from "@/hooks/useAuth";
import { StackRoutesType } from "@/routes";
import api from "@/services/api";
import { logger } from "@/services/logger";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

type Post = {
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
    const { authUser } = useGoogleAuthContext()

    useEffect(() => {
        if (fetchedPosts) {
            console.log("Atualizou os posts, total:", fetchedPosts.length);
            setPosts(fetchedPosts.map((post) => {
                return {
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
            };
            const newPost = await handlePost(newPostDTO);
            setPosts([
                ...posts,
                {
                    author: newPost.user_name,
                    body: newPost.content,
                    createdAt: newPost.created_at,
                }
            ]);
            logger.setUserProperty("Posts: ", posts.toString());
        } else {
            Toast.show({
                type: 'error',
                text1: 'Ops!',
                text2: 'É preciso logar para postar!'
            });
        }
    }

    const openForumModal = () => {
        logger.logEvent("Clicou para abrir o forum da class:", params.sclass);
        setIsForumModalOpen(true);
    }

    return (
        <VStack>
            <Box flex={1}>
                <Typography color="grayOne" fontSize={22}>Teste</Typography>
            </Box>
            {posts.map((post) => {
                return <MemoPost post={post} />
            }
            )}
            <Button
                variant="outlined"
                title={"Postar no forum de " + params.sclass?.subject_code}
                onPress={() => { openForumModal(); }}
            />
            <Box flex={1}>
                <ForumModal
                    sclass={params.sclass}
                    isOpen={isForumModalOpen}
                    onClose={() => setIsForumModalOpen(false)}
                    onHandleNewPost={handleAddNewPost}
                />
            </Box>
        </VStack>
    );
}

type PostCardProps = {
    post: Post;
}
function PostCard({ post }: PostCardProps) {
    return (
        <Pressable /*onPress={selectClass}*/>
            <HStack
                alignItems="center"
                backgroundColor={"grayFive"}
                borderRadius={8}
                padding="m"
                marginBottom="s"
            >
                <VStack flex={1} marginRight={"xs"}>
                    <Typography
                        marginBottom={"xxs"}
                        fontSize={16}
                        color="white"
                        variant={"heading"} >{post.body}</Typography>
                    <HStack>
                        <Typography
                            color="grayOne"
                            paddingRight={"xxs"}
                            numberOfLines={2}>
                            {post.author} </Typography>
                        <Typography
                            color="grayOne"
                            numberOfLines={2}
                            variant="heading">
                            {post.createdAt} </Typography>
                    </HStack>
                </VStack>
            </HStack>
        </Pressable>
    );
}
const MemoPost = React.memo(PostCard);
