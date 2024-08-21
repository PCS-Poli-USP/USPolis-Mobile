import { Box, Button, Typography, VStack, HStack } from "@/components";
import { ReportPostRequest, ForumPostReply, ForumPostReplyResponse } from "@/dtos/forum";
import { useGoogleAuthContext } from "@/hooks/useAuth";
import { StackRoutesType } from "@/routes";
import api from "@/services/api";
import { useCreatePostReply, usePostReplies} from "@/hooks/react-query/usePosts";

import {ForumPostReplyModal} from "@/components/ForumPostReplyModal"
import FeatherIcons from '@expo/vector-icons/Feather'

import { RouteProp, useRoute } from "@react-navigation/native";
import React, {useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import { Dimensions, ScrollView } from 'react-native'

export function ForumContent(){
    const { authUser, getUserToken } = useGoogleAuthContext()
    const [isForumPostReplyModalOpen, setIsForumPostReplyModalOpen] = useState(false)
    const { params } = useRoute<RouteProp<StackRoutesType, "ForumContent">>();
    const post  = params.post
    const sclass = params.sclass

    const { width, height } = Dimensions.get('window');

    
    const handlePostReply = useCreatePostReply();
    const formatDatetime = (datetime : string) => {
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
    const {data: fetchedPostReplies} = usePostReplies(post? post?.id : -1)
    useEffect(()=>{
        if(fetchedPostReplies) {
            setPostReplies(fetchedPostReplies.map((postReply)=>{
                return{
                    id: postReply.id,
                    forum_post_id:postReply.forum_post_id,
                    class_id: postReply.class_id,
                    subject_id:postReply.subject_id,
                    content:postReply.content,
                    user_id: postReply.user_id,
                    user_name:postReply.user_name,
                    created_at:postReply.created_at,
                }

            }))
        }

    }, [fetchedPostReplies]);

    async function handleAddNewReply(body: string) {
        if (authUser) {

            const newPostReplyDTO: ForumPostReply = {
                class_id: sclass? sclass.id : -1,
                content: body,
                user_id: authUser.id,
                subject_id: sclass? sclass?.subject_id : -1,
            } 
            const userToken = getUserToken()
            const newPostReply = await handlePostReply(post? post.id:-1, newPostReplyDTO, `${userToken}`)

            setPostReplies([
                ...postReplies,
                {
                    id: newPostReply.id,
                    forum_post_id:newPostReply.forum_post_id,
                    class_id: newPostReply.class_id,
                    subject_id:newPostReply.subject_id,
                    content:newPostReply.content,
                    user_id: newPostReply.user_id,
                    user_name:newPostReply.user_name,
                    created_at:newPostReply.created_at,
                }
            ]);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Ops!',
                text2: 'É preciso logar para postar!'
            });
        }
    }


    async function reportPost () {

        if (authUser) {
            const reportPostDTO: ReportPostRequest = {
                user_id: authUser.id,
                post_id: post? post.id : 0,
            };

            try{
                await api.post('/forum/report-post', reportPostDTO)
                Toast.show({
                    type: 'info',
                    text1: 'Muito obrigado!',
                    text2: 'Sua solicitação foi enviada para análise.'
                });

            } catch (e){
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
                        onTouchEnd={reportPost}
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

                    <Box
                        position="absolute"
                        right={0}
                        bottom={0}
                        padding="xs"
                    >
                        <Typography
                            color="grayThree"
                            fontSize={12}
                            
                        >
                            {formatDatetime(post? post?.createdAt:'')} 
                        </Typography>
                    </Box>
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
                    maxHeight={height*0.8}
                >
                    <ScrollView>
                        {postReplies?
                            <Box>
                                {postReplies.map((postReply, index)=>{
                                    return(
                                       <Box key={index}>
                                            {ReplyCard(postReply, index)}
                                            {index===postReplies.length-1 &&
                                                <Box 
                                                    height={250}
                                                />
                                            }
                                       </Box>
                                    )
                                })}
                               
                            </Box>     
                        :
                            <Box/>
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
                    style={{ height: 50, width:'80%' }}
                />
            </Box>

            <ForumPostReplyModal
                post={post}
                isOpen={isForumPostReplyModalOpen}
                onClose={closeReplyModal}
                onHandleNewPostReply={handleAddNewReply}
            />

        </VStack>
    )
}

function ReplyCard (postReply:ForumPostReplyResponse, index:number){
    const formatDatetime = (datetime : string) => {
        const date = new Date(datetime);
        const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', day: 'numeric' });
        
        return formatter.format(date);
    }

    return(
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
                <Typography color="white" fontSize={16}>
                    {postReply.user_name}
                </Typography>
                <Typography
                    key={index}
                    color="grayTwo"

                >
                    {postReply.content}
                    {'\n'}
                </Typography>
                <Box
                    position="absolute"
                    right={0}
                    bottom={0}
                    padding="xs"
                >
                    <Typography
                        color="grayThree"
                        fontSize={12}
                        
                    >
                        {formatDatetime(postReply.created_at)} 
                    </Typography>

                </Box>
                <Box
                    position="absolute"
                    right={5}
                    top={0}
                    padding="xs"
                    paddingTop="xxs"
                >
                    <Typography
                        color="grayThree"
                        fontSize={16}
                        
                    >
                        ... 
                    </Typography>

                </Box>

            </Box>
        </Box>
    )
}