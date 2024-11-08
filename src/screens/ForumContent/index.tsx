import { Box, Button, Typography, VStack, HStack } from "@/components";
import { ReportPostRequest, ForumPostReply, ForumPostReplyResponse, LikedPostRequest } from "@/dtos/forum";
import { useGoogleAuthContext } from "@/hooks/useAuth";
import { StackRoutesType } from "@/routes";
import api from "@/services/api";
import { useCreatePostReply } from "@/hooks/react-query/usePosts";
import { TouchableOpacity, Dimensions, ScrollView } from 'react-native'

import { ForumPostReplyModal } from "@/components/ForumPostReplyModal"
import FeatherIcons from '@expo/vector-icons/Feather'

import { RouteProp, useRoute, useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import Toast from "react-native-toast-message";
import { logger } from "@/services/logger";

export function ForumContent() {
    const { authUser, getUserToken } = useGoogleAuthContext()
    const [isForumPostReplyModalOpen, setIsForumPostReplyModalOpen] = useState(false)
    const { params } = useRoute<RouteProp<StackRoutesType, "ForumContent">>();
    const post = params.post
    const sclass = params.sclass

    const { width, height } = Dimensions.get('window');
    const [likeCount, setLikeCount] = useState<number>(post? post.likes_count? post.likes_count : 0 : 0)
    const [likedState, setLikedState] = useState<boolean>(post? post.user_liked : false)
        
    const handlePostReply = useCreatePostReply();

    const openReplyModal = () => {
        setIsForumPostReplyModalOpen(true)
    }

    const closeReplyModal = () => {
        setIsForumPostReplyModalOpen(false)
    }

    const [postReplies, setPostReplies] = useState<ForumPostReplyResponse[]>([]);
    // const { data: fetchedPostReplies } = usePostReplies(post ? post.id : -1, authUser? authUser.id : -1)
    // useEffect(() => {
    //     if (fetchedPostReplies) {
    //         setPostReplies(fetchedPostReplies.map((postReply) => {
    //             return {
    //                 id: postReply.id,
    //                 forum_post_id: postReply.forum_post_id,
    //                 class_id: postReply.class_id,
    //                 subject_id: postReply.subject_id,
    //                 content: postReply.content,
    //                 user_id: postReply.user_id,
    //                 user_name: postReply.user_name,
    //                 created_at: postReply.created_at,
    //                 likes_count: postReply.likes_count,
    //                 user_liked: postReply.user_liked
    //             }

    //         }))
    //     }

    // }, [fetchedPostReplies]);
    const fetchPostReplies = async () => {
        try {
            const response = await api.get<ForumPostReplyResponse[]>(`forum/posts/${post? post.id : -1}`, {
                params: {
                    user_id: authUser? authUser.id : -1
                }
            })
            
            if (response.data) {
                setPostReplies(response.data.map((postReply) => {
                    return {
                        id: postReply.id,
                        forum_post_id: postReply.forum_post_id,
                        class_id: postReply.class_id,
                        subject_id: postReply.subject_id,
                        content: postReply.content,
                        user_id: postReply.user_id,
                        user_name: postReply.user_name,
                        created_at: postReply.created_at,
                        likes_count: postReply.likes_count,
                        user_liked: postReply.user_liked
                    }
    
                }))
            }
        } catch (error) {
            console.log('erro:', error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchPostReplies();
        }, [])
    );

    async function handleAddNewReply(body: string) {
        if (authUser) {

            const newPostReplyDTO: ForumPostReply = {
                class_id: sclass ? sclass.id : -1,
                content: body,
                user_id: authUser.id,
                subject_id: sclass ? sclass?.subject_id : -1,
            }
            const userToken = await getUserToken()
            const newPostReply = await handlePostReply(post ? post.id : -1, newPostReplyDTO, `${userToken}`)

            setPostReplies([
                ...postReplies,
                {
                    id: newPostReply.id,
                    forum_post_id: newPostReply.forum_post_id,
                    class_id: newPostReply.class_id,
                    subject_id: newPostReply.subject_id,
                    content: newPostReply.content,
                    user_id: newPostReply.user_id,
                    user_name: newPostReply.user_name,
                    created_at: newPostReply.created_at,
                    likes_count: newPostReply.likes_count,
                    user_liked: false,
                }
            ]);
            logger.logEvent("Novo reply de um post no forum", { user_id: authUser.id, subject: params.sclass?.subject_code, reply_of_post_id: post?.id });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Ops!',
                text2: 'É preciso logar para postar!'
            });
        }
    }


    async function reportPost(reportedPostId: number) {

        if (authUser) {
            const reportPostDTO: ReportPostRequest = {
                user_id: authUser.id,
                post_id: reportedPostId,
            };

            try {
                await api.post('/forum/report', reportPostDTO)
                Toast.show({
                    type: 'info',
                    text1: 'Muito obrigado!',
                    text2: 'Sua solicitação foi enviada para análise.'
                });

            } catch (e) {
                Toast.show({
                    type: 'error',
                    text1: 'Ops!',
                    text2: 'Ocorreu um erro, tente novamente mais tarde.'
                });
            }

        } else {
            Toast.show({
                type: 'error',
                text1: 'Ops!',
                text2: 'É preciso logar para reportar!'
            });
        }

    }

    async function changeLikeState (likedPostId: number, newLikeState: boolean) {
        if (authUser) {

            const likedPostDTO: LikedPostRequest = {
                user_id: authUser.id,
                post_id: likedPostId,
                like_state: newLikeState
            };

            try {
                await api.post(`/forum/posts/${likedPostId}/liked`, likedPostDTO)
                setLikedState(newLikeState)
                setLikeCount(newLikeState? likeCount+1 : likeCount-1)

            } catch (e) {
                Toast.show({
                    type: 'error',
                    text1: 'Ops!',
                    text2: 'Ocorreu um erro, tente novamente mais tarde.'
                });
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Ops!',
                text2: 'É preciso logar para reagir à postagem!'
            });
        }
    }

    return (
        <VStack flex={1} marginRight={"xs"}>
            <Box
                max-height={'90%'}
                paddingHorizontal="m"
                paddingVertical="xs"
                borderRadius={5}
            >
                <HStack alignItems="center" justifyContent="center" paddingHorizontal="s">
                    <Box
                        maxWidth={'80%'}
                    >

                        <Typography
                            color="grayOne"
                            paddingRight={"xxs"}
                            fontSize={16}
                            fontWeight="bold"
                            numberOfLines={1}
                            ellipsizeMode="tail"

                        >
                            {post?.author}
                        </Typography>
                    </Box>

                    <Box
                        paddingRight="xxs"
                        onTouchEnd={() => { reportPost(post ? post.id : -1) }}
                    >
                        <HStack alignItems="center" justifyContent="center" paddingHorizontal="xxs">
                            <Typography
                                color="grayOne"
                                paddingRight={"xs"}
                                fontSize={12}
                                fontWeight="bold"
                                numberOfLines={1}
                                ellipsizeMode="tail"

                            >
                                Reportar
                            </Typography>

                            <FeatherIcons name="flag" color="white" size={12} />

                        </HStack>
                    </Box>
                </HStack>

                <Box
                    backgroundColor="grayFour"
                    padding="s"
                    paddingTop="xxs"
                    margin="xs"
                    borderRadius={5}
                    alignContent="flex-start"
                >
                    <Typography
                        marginTop="m"
                        marginBottom="l"
                        marginLeft="s"
                        fontSize={20}
                        color="white"
                    >

                        {post?.body}
                        {'\n'}
                    </Typography>

                    <HStack
                        position="absolute"
                        right={10}
                        bottom={5}
                        margin="xxs"
                    >
                        <Box
                            backgroundColor=  "graySeven"
                            paddingVertical="xs"
                            paddingHorizontal="s"
                            borderRadius={10}
                            borderWidth={0.5}
                            borderColor={likedState? "secondary" : "white"}
        
                            onTouchEnd={() => changeLikeState(post? post.id: -1, !likedState)}
                        >
                            <HStack>
                                <Typography color={likedState? 'primary':'white'} paddingRight={"s"}>
                                    {likeCount}
                                </Typography>
                                <FeatherIcons name="thumbs-up" color={likedState? '#18DAD7':'#E1E1E6'} size={20} />
                            </HStack>
                        </Box>
                    </HStack>
                </Box>
            </Box>

            <Box>
                <Typography
                    color="white"
                    fontSize={20}
                    paddingHorizontal="m"
                    paddingTop="m"
                >
                    Comentários
                </Typography>

                <Box
                    maxHeight={height * 0.8}
                >
                    <ScrollView>
                        {postReplies ?
                            <Box>
                                {postReplies.map((postReply, index) => {
                                    return (
                                        <Box key={index}>
                                            <ReplyCard 
                                                index={index} 
                                                postReply={postReply} 
                                                reportPost={reportPost} 
                                            />
                                            {index === postReplies.length - 1 &&
                                                <Box
                                                    height={250}
                                                />
                                            }
                                        </Box>
                                    )
                                })}

                            </Box>
                            :
                            <Box />
                        }

                    </ScrollView>
                </Box>
            </Box>

            <Box
                backgroundColor="graySeven"
                opacity={0.8}
                paddingHorizontal="m"
                position="absolute"
                bottom={0}
                alignItems="center"
                width={'100%'}
                padding="l"
                flex={1}
            >
                <Button
                    variant="outlined"
                    title={"Responder postagem"}
                    onPress={openReplyModal}
                    style={{ height: 50, width: '80%' }}
                />
            </Box>

            {isForumPostReplyModalOpen &&
                <ForumPostReplyModal
                    post={post}
                    isOpen={isForumPostReplyModalOpen}
                    onClose={closeReplyModal}
                    onHandleNewPostReply={handleAddNewReply}
                />

            }

        </VStack>
    )
}



type ReplyCardProps = {
    index: number;
    postReply: ForumPostReplyResponse;
    reportPost: (reportedPostId: number) => Promise<void>;
};

const ReplyCard: React.FC<ReplyCardProps>=({postReply, index, reportPost}) => {
    const { authUser} = useGoogleAuthContext()
    const [isLiked, setIsLiked] = useState<boolean>(postReply.user_liked);
    const [replyLikeCount, setReplyLikeCount] = useState<number>(postReply? postReply.likes_count :0);
    
    async function changeReplyLikeState (likedPostId: number, newLikeState: boolean) {
        if (authUser) {

            const likedPostDTO: LikedPostRequest = {
                user_id: authUser.id,
                post_id: likedPostId,
                like_state: newLikeState
            };

            try {
                await api.post(`/forum/posts/${likedPostId}/liked`, likedPostDTO)

                setIsLiked(newLikeState)
                setReplyLikeCount(newLikeState? replyLikeCount+1 : replyLikeCount-1)

            } catch (e) {
                Toast.show({
                    type: 'error',
                    text1: 'Ops!',
                    text2: 'Ocorreu um erro, tente novamente mais tarde.'
                });
            }
        } else{
            Toast.show({
                type: 'error',
                text1: 'Ops!',
                text2: 'É preciso logar para curtir!'
            });
        }
    }

    const formatDatetime = (datetime: string) => {
        const date = new Date(datetime);
        const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', day: 'numeric' });

        return formatter.format(date);
    }

    return (
        <Box
            key={index}
            paddingHorizontal="m"
            paddingVertical="xs"
        >

            <Box

                padding="s"
                backgroundColor="graySix"
                borderRadius={5}

            >
                <HStack>
                    <Box>
                        <HStack>
                            <Typography color="white" fontSize={18}>
                                {postReply.user_name}
                            </Typography>
                            <Typography
                                    color="grayThree"
                                    fontSize={16}
                                >
                                    {' • ' + formatDatetime(postReply.created_at)}
                            </Typography>
                        </HStack>
                    </Box>
                    <Box
                        position="absolute"
                        right={5}
                        top={5}
                        padding="xs"
                        paddingTop="xxs"
                        onTouchEnd={() => { reportPost(postReply.id) }} 
                    >
                        <FeatherIcons name="flag" color="white" size={12} />
                    </Box>
                </HStack>
                <Typography
                    key={index}
                    color="grayOne"
                    marginVertical="m"
                    fontSize={18}             
                >
                    {postReply.content}
                    {'\n'}
                </Typography>

                <HStack marginTop="xs">
                        <Box
                            position="absolute"
                            right={10}
                            bottom={5}
                            backgroundColor=  "graySeven"
                            paddingVertical="xs"
                            paddingHorizontal="s"
                            borderRadius={10}
                            borderWidth={0.5}
                            borderColor={isLiked? "secondary" : "white"}
                            onTouchEnd={() => {changeReplyLikeState(postReply.id, !isLiked)}}     
                        >

                            <HStack >
                                <Typography color={isLiked? "primary":"white"} paddingRight={"s"}>
                                    {replyLikeCount}
                                </Typography>
                                <FeatherIcons name="thumbs-up" color={isLiked? "#18DAD7":"white"} size={20} />
                                
                            </HStack>

                        </Box>

                </HStack>
            </Box>
        </Box>
    );
}