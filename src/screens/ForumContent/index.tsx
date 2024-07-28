import { Box, Button, Typography, VStack, HStack } from "@/components";
import { ReportPostRequest } from "@/dtos/forum";
import { useGoogleAuthContext } from "@/hooks/useAuth";
import { StackRoutesType } from "@/routes";
import api from "@/services/api";

import { RouteProp, useRoute,  } from "@react-navigation/native";
import React from "react";
import Toast from "react-native-toast-message";



export function ForumContent(){
    const { authUser } = useGoogleAuthContext()

    const { params } = useRoute<RouteProp<StackRoutesType, "ForumContent">>();
    const post  = params.post

    const formatDatetime = (datetime : string) => {
        const date = new Date(datetime);
        const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', day: 'numeric' });
        
        return formatter.format(date);
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
                margin="m"
                backgroundColor="graySix"
                padding="m"
                borderRadius={15}
            >
                <HStack alignItems="center" justifyContent="center">
                    <Box
                        maxWidth={'80%'}
                    >

                        <Typography
                            color="grayOne"
                            paddingRight={"xxs"}
                            fontSize={20}
                            fontWeight="bold"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        
                        >
                            {post?.author}
                        </Typography>
                    </Box>
                    <Typography
                        color="grayOne"
                        paddingRight={"xxs"}
                        fontSize={20}
                        fontWeight="bold"
                    >
                     ·
                    </Typography>
                    <Typography
                        color="grayOne"
                        fontSize={16}
                    >
                          {formatDatetime(post? post?.createdAt:'')} 
                    </Typography>
                </HStack>
                <Typography
                    marginTop="m"
                    marginBottom={"xxs"}
                    fontSize={16}
                    color="white"
                >
                        
                    {post?.body}
                
                </Typography>
            </Box>
            <Box
                backgroundColor="transparent"

                paddingHorizontal="m"
                position="absolute"
                bottom={30}
                alignItems="center"
                width={'100%'}
            >
                <Button
                    variant="outlined"
                    title={"Reportar post!"}
                    onPress={reportPost}
                    style={{ height: 80, width:240 }}
                />
            </Box>

        </VStack>
    )
}