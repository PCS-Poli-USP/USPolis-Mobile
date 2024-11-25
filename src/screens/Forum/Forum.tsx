import { Box, Button, Pressable, Typography, VStack, HStack, Input } from "@/components";
import FeatherIcons from "@expo/vector-icons/Feather"
import { ForumModal } from "@/components/ForumModal";
import { PostRequest, PostTag } from "@/dtos/forum";
import { useCreatePost } from "@/hooks/react-query/usePosts";
import { useGoogleAuthContext } from "@/hooks/useAuth";
import { StackRoutesType } from "@/routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { logger } from "@/services/logger";
import { RouteProp, useRoute, useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import Toast from "react-native-toast-message";
import { Dimensions, ScrollView } from "react-native"
import { IClass } from "@/dtos";
import { useTheme } from "@shopify/restyle"
import { Theme } from "@/theme/theme"
import { fetchFilteredPosts, fetchPosts } from "@/services/ForumService";
import { ForumPostsFilter } from "@/components/ForumPostsFilter/ForumPostsFilter";

export type Post = {
    id: number;
    author: string;
    body: string;
    createdAt: string;
    replies_count: number;
    likes_count: number;
    user_liked: boolean;
    reply_of_post_id: number | null;
};

export type ForumSearch = {
    keyword: string;
};

export function Forum() {
    const { params } = useRoute<RouteProp<StackRoutesType, "Forum">>();
    const [isForumModalOpen, setIsForumModalOpen] = useState<boolean>(false);
    const [activeFilters, setActiveFilters] = useState<PostTag[]>([]);
    const { authUser, isLoggedIn, getUserToken } = useGoogleAuthContext();
    const handlePost = useCreatePost();
    const [posts, setPosts] = useState<Post[]>([]);
    const [tempPosts, setTempPosts] = useState<Post[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>();

    const { width, height } = Dimensions.get("window");
    const screenWidth = width;
    const screenHeight = height;
    // subject_id == -1 means it is the General Forum
    const isGeneralForum = params.sclass?.subject_id == -1;

    useFocusEffect(
        useCallback(() => {
            fetchPosts(params.sclass!, authUser, setPosts, setTempPosts);
            // Reset filters
            setActiveFilters([]);
        }, [])
    );

    async function handleAddNewPost(body: string, tags: PostTag[]) {
        if (authUser) {
            const newPostDTO: PostRequest = {
                user_id: authUser.id,
                content: body,
                class_id: params.sclass!.id,
                subject_id: params.sclass!.subject_id,
                filter_tags: tags.map((tag) => tag.tag),
            };

            const idToken = await getUserToken();
            const newPost = await handlePost(newPostDTO, idToken);
            setPosts([
                {
                    id: newPost.id,
                    author: newPost.user_name,
                    body: newPost.content,
                    createdAt: newPost.created_at,
                    replies_count: newPost.replies_count,
                    likes_count: newPost.likes_count,
                    user_liked: newPost.user_liked,
                    reply_of_post_id: null
                },
                ...posts,
            ]);
            logger.logEvent("Novo post no forum", { user_id: authUser.id, subject: params.sclass?.subject_code });
        } else {
            Toast.show({
                type: "error",
                text1: "Ops!",
                text2: "É preciso logar para postar!"
            });
        }
    }

    const openForumModal = () => {
        setIsForumModalOpen(true);
    };

    function filterPosts(postFilterTag: PostTag, isActive: boolean): void {
        let newFilters
        if (isActive) {
            newFilters = activeFilters.filter((e) => { return postFilterTag.name != e.name });
            setActiveFilters(newFilters);
        } else {
            newFilters = [...activeFilters, postFilterTag]
            setActiveFilters(newFilters);
        }
        fetchFilteredPosts(params.sclass!, authUser, newFilters, searchKeyword, setPosts);
    }

    return (
        <VStack flex={1} width={screenWidth} >
            <Box
                paddingHorizontal="m"
                paddingVertical="m"
                marginTop="s"
                height={screenHeight - 210}
            >
                <ScrollView>
                    <HStack
                        paddingHorizontal="s"
                    >
                        <Box >
                            <Input
                                variation="secondary"
                                placeholder={`Procure no Fórum ${isGeneralForum ? "Geral" : `de ${params.sclass?.subject_code}`}`}
                                onEndEditing={() => fetchFilteredPosts(params.sclass!, authUser, activeFilters, searchKeyword, setPosts)}
                                onChangeText={(text) => setSearchKeyword(text)}
                                width={screenWidth * 0.85}
                            />

                        </Box>

                    </HStack>


                    <ForumPostsFilter
                        myProperty="s"
                        activeFilters={activeFilters}
                        filterPosts={filterPosts}
                    />

                    <HStack paddingTop="m">
                        <Typography color="grayOne" fontSize={20} marginBottom="s" >
                            Posts
                        </Typography>

                        <Typography color="grayOne" fontSize={16} marginBottom="s" paddingRight="s" >
                            {posts ? posts.length : 0}
                        </Typography>
                    </HStack>

                    {posts?.length === 0 ?
                        <Box backgroundColor="grayFive" padding="s" borderRadius={5} alignContent="center">
                            <Typography color="grayOne" fontSize={16} lineHeight={24}>
                                Ainda ninguém postou neste fórum 😞 {"\n"}
                                Seja o primeiro a postar!{"\n"}
                                Tenha educação e respeito com os outros 😊
                            </Typography>
                        </Box>
                        :

                        <VStack>
                            <Box width={screenWidth * 0.95}>
                                {posts.map((post, index) => {
                                    return <MemoPost key={index} post={post} sclass={params.sclass} tempPosts={tempPosts} />
                                })}
                            </Box>
                        </VStack>
                    }

                </ScrollView>
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

            {isForumModalOpen &&
                <Box flex={1}>
                    <ForumModal
                        sclass={params.sclass}
                        isOpen={isForumModalOpen}
                        isGeneralForum={isGeneralForum}
                        onClose={() => setIsForumModalOpen(false)}
                        onHandleNewPost={handleAddNewPost} />
                </Box>

            }

        </VStack>
    );
}

type PostCardProps = {
    post: Post;
    sclass: IClass | undefined;
    tempPosts: Post[];
};

function PostCard({ post, sclass, tempPosts }: PostCardProps,) {
    const { colors } = useTheme<Theme>()
    const navigationStack = useNavigation<NavigationProp<StackRoutesType>>()

    const mainPost = tempPosts.find((tempPost) => tempPost.id === post.reply_of_post_id);
    const selectPost = () => {
        if (mainPost) {
            navigationStack.navigate("ForumContent",
                { post: mainPost, sclass }
            );
        } else {
            navigationStack.navigate("ForumContent",
                { post, sclass }
            );
        }

    };

    const formatDatetime = (datetime: string) => {
        const date = new Date(datetime);

        const formatter = new Intl.DateTimeFormat("pt-BR", { month: "long", day: "numeric" });

        return formatter.format(date);
    };

    return (
        <Pressable onPress={selectPost}>
            <HStack
                alignItems="center"
                backgroundColor={"grayFive"}
                borderRadius={8}
                padding="m"
                paddingTop="s"
                marginBottom="s"
            >
                <VStack flex={1} paddingRight="m">
                    <HStack paddingBottom="m">

                        <Typography
                            color="grayThree"
                            paddingRight={"xxs"}
                            numberOfLines={2}
                        >
                            {post.author}
                        </Typography>

                        <Typography
                            color="grayThree"
                            numberOfLines={2}
                            variant="heading"
                        >
                            {formatDatetime(post.createdAt)}
                        </Typography>
                    </HStack>
                    <HStack marginBottom={"m"} >
                        <Typography

                            fontSize={18}
                            color="white"
                            variant={"heading"}
                        >
                            {post.body}
                        </Typography>
                        {!post.reply_of_post_id &&
                            <FeatherIcons
                                name="chevron-right"
                                color={colors.grayThree}
                                size={24}
                                style={{
                                    marginTop: 5
                                }}
                            />
                        }


                    </HStack>
                    {post.reply_of_post_id &&
                        <Box
                            backgroundColor="grayFour"
                            borderRadius={5}
                            marginBottom="m"
                        >
                            <HStack>
                                <Typography
                                    padding="s"
                                    color="white"
                                >
                                    Resposta de outro post, clique para abrir
                                </Typography>
                                <FeatherIcons
                                    name="chevron-right"
                                    color={colors.grayThree}
                                    size={24}
                                    style={{
                                        marginTop: 5
                                    }}
                                />
                            </HStack>
                        </Box>
                    }
                    <HStack
                        flexDirection="row"
                        alignItems="center"
                        marginVertical="s"
                        padding="s"
                    >
                        <Box
                            position="absolute"
                            left={"80%"}
                            backgroundColor="graySix"
                            paddingVertical="xs"
                            paddingHorizontal="s"
                            borderRadius={10}
                        >
                            <HStack margin="xxs">
                                <HStack >
                                    <Typography color="grayOne" paddingRight={"xxs"}>
                                        {post.replies_count}
                                    </Typography>
                                    <FeatherIcons name="message-square" color="white" size={20} />
                                </HStack>

                                <HStack paddingLeft="s">
                                    <Typography color="grayOne" paddingRight={"xxs"}>
                                        {post.likes_count ? post.likes_count : 0}
                                    </Typography>
                                    <FeatherIcons name="thumbs-up" color="white" size={20} />
                                </HStack>
                            </HStack>
                        </Box>
                    </HStack>
                </VStack>
            </HStack>
        </Pressable>
    );
}
const MemoPost = React.memo(PostCard);
