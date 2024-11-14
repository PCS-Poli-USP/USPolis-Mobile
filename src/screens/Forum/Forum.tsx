import { Box, Button, Pressable, Typography, VStack, HStack } from "@/components";
import FeatherIcons from '@expo/vector-icons/Feather'
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
import { Dimensions, ScrollView } from 'react-native'
import { IClass } from "@/dtos";
import { ForumSearchModal } from "@/components/ForumSearchModal";
import { useTheme } from '@shopify/restyle'
import { Theme } from '@/theme/theme'
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
};

export function Forum() {
    const { params } = useRoute<RouteProp<StackRoutesType, "Forum">>();
    const [isForumModalOpen, setIsForumModalOpen] = useState<boolean>(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(true);
    const [activeFilters, setActiveFilters] = useState<PostTag[]>([]);
    const { authUser, isLoggedIn, getUserToken } = useGoogleAuthContext()
    const handlePost = useCreatePost();
    const [posts, setPosts] = useState<Post[]>([]);

    const { width, height } = Dimensions.get('window');
    const screenWidth = width
    const screenHeight = height

    useFocusEffect(
        useCallback(() => {
            fetchPosts(params.sclass!, authUser, setPosts);
            // Reset filters
            setActiveFilters([]);
        }, [])
    );

    async function handleAddNewPost(body: string) {
        if (authUser) {
            const newPostDTO: PostRequest = {
                user_id: authUser.id,
                content: body,
                class_id: params.sclass!.id,
                subject_id: params.sclass!.subject_id
            };

            const idToken = await getUserToken()
            const newPost = await handlePost(newPostDTO, idToken);
            setPosts([
                ...posts,
                {
                    id: newPost.id,
                    author: newPost.user_name,
                    body: newPost.content,
                    createdAt: newPost.created_at,
                    replies_count: newPost.replies_count,
                    likes_count: newPost.likes_count,
                    user_liked: newPost.user_liked,
                }
            ]);
            logger.logEvent("Novo post no forum", { user_id: authUser.id, subject: params.sclass?.subject_code });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Ops!',
                text2: 'É preciso logar para postar!'
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
        fetchFilteredPosts(params.sclass!, authUser, newFilters, setPosts);
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

                    <ForumPostsFilter
                        activeFilters={activeFilters}
                        filterPosts={filterPosts}
                    />
                    { /* SEARCH BAR
                    <Box
                        paddingHorizontal="s"
                        width={screenWidth * 0.9} 
                        borderRadius={30}
                        backgroundColor="grayThree"
                    >
                        <TouchableOpacity >
                            <HStack>
                                <Box padding="s">
                                    <FeatherIcons name="search" color="white" size={20}/>
                                </Box>
                                <Box justifyContent='center'>
                                    <Input
                                        placeholder="Pesquisar no Fórum"
                                        placeholderTextColor='white'
                                        backgroundColor="transparent"
                                        style={{  color: '#FFFFFF', fontSize: 20, paddingTop: 5}}
                                        height='auto'
                                        textAlignVertical="bottom"
                                        maxWidth={screenWidth * 0.65}
                                    
                                    />

                                </Box>



                                <Box backgroundColor="grayFour" borderRadius={90} padding="s" onTouchStart={openFilterModal}>
                                    <FeatherIcons name="plus" color="white" size={20} />
                                </Box>

                            </HStack>

                        </TouchableOpacity> 
                    </Box>*/
                    }

                    <HStack paddingTop="m">
                        <Typography color="grayOne" fontSize={20} marginBottom="s" >
                            Posts
                        </Typography>

                        <Typography color="grayOne" fontSize={16} marginBottom="s" paddingRight="s" >
                            {posts ? posts.length : 0}
                        </Typography>
                    </HStack>

                    {posts?.length === 0 ?
                        <Box alignContent="center">
                            <Typography color="grayOne" fontSize={16}>
                                Ainda ninguém postou neste fórum 😞 {"\n"}
                                Seja o primeiro a postar!
                            </Typography>
                        </Box>
                        :

                        <VStack>
                            <Box width={screenWidth * 0.95}>
                                {posts.map((post, index) => {
                                    return <MemoPost key={index} post={post} sclass={params.sclass} />
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
                        onClose={() => setIsForumModalOpen(false)}
                        onHandleNewPost={handleAddNewPost} />
                </Box>

            }
            {isSearchModalOpen &&
                <Box >
                    <ForumSearchModal
                        isOpen={isSearchModalOpen}
                        onClose={() => setIsSearchModalOpen(false)}
                    />
                </Box>
            }

        </VStack>
    );
}

type PostCardProps = {
    post: Post;
    sclass: IClass | undefined
};
function PostCard({ post, sclass }: PostCardProps) {
    const { colors } = useTheme<Theme>()
    const navigationStack = useNavigation<NavigationProp<StackRoutesType>>()

    const selectPost = () => {
        navigationStack.navigate('ForumContent',
            { post, sclass }
        )

    };

    const formatDatetime = (datetime: string) => {
        const date = new Date(datetime);

        const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', day: 'numeric' });

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
                    <HStack marginBottom={"l"} >
                        <Typography

                            fontSize={18}
                            color="white"
                            variant={"heading"}
                        >
                            {post.body}
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
                    <HStack
                        flexDirection="row"
                        alignItems="center"
                        marginVertical="s"
                        padding="s"
                    >
                        <Box
                            position="absolute"
                            left={'80%'}
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
