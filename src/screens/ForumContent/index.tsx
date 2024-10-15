import { Box, Button, Typography, VStack, HStack } from "@/components";
import { ReportPostRequest, ForumPostReply, ForumPostReplyResponse, LikedPostRequest } from "@/dtos/forum";
import { useGoogleAuthContext } from "@/hooks/useAuth";
import { StackRoutesType } from "@/routes";
import api from "@/services/api";
import { useCreatePostReply, usePostReplies, useForumLikes } from "@/hooks/react-query/usePosts";
import { TouchableOpacity, Dimensions, ScrollView } from 'react-native'

import { ForumPostReplyModal } from "@/components/ForumPostReplyModal"
import FeatherIcons from '@expo/vector-icons/Feather'

import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import { logger } from "@/services/logger";

export function ForumContent() {
    const { authUser, getUserToken } = useGoogleAuthContext()
    const [isForumPostReplyModalOpen, setIsForumPostReplyModalOpen] = useState(false)
    const { params } = useRoute<RouteProp<StackRoutesType, "ForumContent">>();
    const post = params.post
    const sclass = params.sclass

    const { width, height } = Dimensions.get('window');
    const { data: fetchedUserForumLikes} =  useForumLikes(authUser? authUser.id : -1)
    const [likedPostsIds, setLikedPostsIds] = useState<number[]>([])
    const [likeCount, setLikeCount] = useState<number>(post? post.likes_count? post.likes_count : 0 : 0)
    const [likedState, setLikedState] = useState<boolean>(false)
    
    useEffect(()=>{
        if (fetchedUserForumLikes){
            setLikedPostsIds(fetchedUserForumLikes?.map((likedPost) => {
                return likedPost.post_id
            }))
           
        }
    }, [fetchedUserForumLikes, post]);

    useEffect(() => {
        if (post) {
            setLikedState(likedPostsIds.includes(post.id));
        }
    }, [likedPostsIds, post]);
    

    const handlePostReply = useCreatePostReply();
    const formatDatetime = (datetime: string) => {
        const date = new Date(datetime);
        const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', day: 'numeric' });

        return formatter.format(date);
    }

    const openReplyModal = () => {
        setIsForumPostReplyModalOpen(true)
    }

    const closeReplyModal = () => {
        setIsForumPostReplyModalOpen(false)
    }

    const [postReplies, setPostReplies] = useState<ForumPostReplyResponse[]>([]);
    const { data: fetchedPostReplies } = usePostReplies(post ? post?.id : -1)
    useEffect(() => {
        if (fetchedPostReplies) {
            setPostReplies(fetchedPostReplies.map((postReply) => {
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
                }

            }))
        }

    }, [fetchedPostReplies]);

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
                if (newLikeState){
                    Toast.show({
                        type: 'info',
                        text1: 'Like :)',
                    });
                } else {
                    Toast.show({
                        type: 'info',
                        text1: 'Dislike :(',
                    });
                }
                setLikedState(newLikeState)
                setLikeCount(newLikeState? likeCount+1 : likeCount-1)

            } catch (e) {
                Toast.show({
                    type: 'error',
                    text1: 'Ops!',
                    text2: 'Ocorreu um erro, tente novamente mais tarde.'
                });
            }
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
                    margin="xxs"
                    borderRadius={5}
                    alignContent="flex-start"
                >
                    <Typography
                        marginTop="xs"
                        marginBottom={"s"}
                        fontSize={16}
                        color="white"
                    >

                        {post?.body}
                        {'\n'}
                    </Typography>

                    <HStack>
                        <Box
                            backgroundColor=  "grayThree"
                            paddingVertical="xs"
                            paddingHorizontal="s"
                            borderRadius={10}
                            onTouchEnd={() => changeLikeState(post? post.id: -1, !likedState)}
                        >
                            <HStack >
                                <HStack>
                                    <Typography color={likedState? 'primary':'white'} paddingRight={"xxs"}>
                                        {likeCount}
                                        {likedState}
                                    </Typography>
                                    <FeatherIcons name="thumbs-up" color={likedState? '#18DAD7':'#E1E1E6'} size={14} />
                                </HStack>
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
                                                likedPostsIds={likedPostsIds}
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
    likedPostsIds: number[]

};

const ReplyCard: React.FC<ReplyCardProps>=({postReply, index, reportPost, likedPostsIds}) => {
    const { authUser} = useGoogleAuthContext()
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [replyLikeCount, setReplyLikeCount] = useState<number>(postReply? postReply.likes_count :0);


    
    useEffect(() => {
            setIsLiked(likedPostsIds.includes(postReply.id));
        }
    , [likedPostsIds]);

    async function changeReplyLikeState (likedPostId: number, newLikeState: boolean) {
        if (authUser) {

            const likedPostDTO: LikedPostRequest = {
                user_id: authUser.id,
                post_id: likedPostId,
                like_state: newLikeState
            };

            try {
                await api.post(`/forum/posts/${likedPostId}/liked`, likedPostDTO)
                if (newLikeState){
                    Toast.show({
                        type: 'info',
                        text1: 'Like :)',
                    });
                } else {
                    Toast.show({
                        type: 'info',
                        text1: 'Dislike :(',
                    });
                }
                setIsLiked(newLikeState)
                setReplyLikeCount(newLikeState? replyLikeCount+1 : replyLikeCount-1)

            } catch (e) {
                Toast.show({
                    type: 'error',
                    text1: 'Ops!',
                    text2: 'Ocorreu um erro, tente novamente mais tarde.'
                });
            }
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
                    <Typography color="white" fontSize={16}>
                        {postReply.user_name}
                    </Typography>
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
                    color="grayTwo"
                    marginTop="xs"
                >
                    {postReply.content}
                    {'\n'}
                </Typography>

                <HStack marginTop="xs">
                    <HStack>
                        <Box
                            backgroundColor=  "grayThree"
                            paddingVertical="xs"
                            paddingHorizontal="s"
                            borderRadius={10}
                            onTouchEnd={() => {changeReplyLikeState(postReply.id, !isLiked)}}
                        >
                            <HStack >
                                <HStack >
                                    <Typography color={isLiked? "primary":"white"} paddingRight={"xxs"}>
                                        {replyLikeCount}
                                    </Typography>
                                    <FeatherIcons name="thumbs-up" color={isLiked? "#18DAD7":"white"} size={12} />
                                   
                                </HStack>
                            </HStack>
                        </Box>
                    </HStack>

                    <Box>
                        <Typography
                            color="grayThree"
                            fontSize={12}
                        >
                            {formatDatetime(postReply.created_at)}
                        </Typography>
                    </Box>
                </HStack>
            </Box>
        </Box>
    );
}