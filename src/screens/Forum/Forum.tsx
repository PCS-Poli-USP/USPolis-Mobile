import { Box, Button, Pressable, Typography, VStack, HStack } from "@/components";
import { ForumModal } from "@/components/ForumModal";
import { usePosts } from "@/hooks/react-query/usePosts";
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
    date: string;
};

const dict: Post[] = [
    {
        author: "Autor1",
        body: "aashdfuiashbfipuahsiufhusahfouhasoui",
        date: "ontem"
    },
    {
        author: "Autor2",
        body: "aashdfuiashbfipuahsiufhusahfouhasouifibdsnaons",
        date: "19/02/2023"
    }
]
export function Forum() {
    const { params } = useRoute<RouteProp<StackRoutesType, "Forum">>();
    const [isForumModalOpen, setIsForumModalOpen] = useState<boolean>(false);
    const { data: fetchedPosts, isLoading: isLoadingPosts } = usePosts(params.sclass!);
    const [posts, setPosts] = useState<Post[]>(dict);
    const { authUser } = useGoogleAuthContext()

    useEffect(() => {
        if (fetchedPosts) {
            console.log("atualizou posts", fetchedPosts);
            setPosts(fetchedPosts.map((post) => {
                return {
                    author: post.author,
                    body: post.content,
                    date: post.created_at
                };
            }));
        }
    }, [fetchedPosts]);

    function handleAddNewPost(body: string) {
        if (authUser) {
            const newPost: Post = {
                author: authUser.given_name,
                body: body,
                date: new Date().toString()
            };
            const newPosts: Post[] = [
                ...posts,
                newPost
            ]
            setPosts(newPosts);
            (async () => {
                const response = await api.post("forum/posts", {
                    author: newPost.author,
                    content: newPost.body,
                    event_id: params.sclass?.schedules[0].id
                })
                console.log("post response=", response.status);
                console.log("post response=", response.data);
            })();
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
        logger.logEvent("Clicou p abrir forum");
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
    )
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
                            {post.date} </Typography>
                    </HStack>
                </VStack>
            </HStack>
        </Pressable>
    )
}
const MemoPost = React.memo(PostCard);
