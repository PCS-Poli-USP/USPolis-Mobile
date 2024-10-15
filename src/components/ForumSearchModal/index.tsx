import React from 'react'
import FeatherIcons from '@expo/vector-icons/Feather'

import { Button } from '../Button'
import { Box, HStack, Typography } from "../ui";
import { Modal } from '../Modal'
import { Input } from '../Input'

interface ForumSearchModalProps {
    isOpen: boolean
    onClose: () => void
}



export const ForumSearchModal = ({
    isOpen,
    onClose
}: ForumSearchModalProps) => {
    const FilterTags = ['Prova', 'Salas', 'Dúvidas', 'Off']

    return (

        <Box 
            flex={1}
        
        >
            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >

                <Box
                    margin='l'
                    height={'80%'}
                    backgroundColor='graySeven'
                    padding='s'
                    borderWidth={2}
                    borderStartColor='secondary'
                    borderStartWidth={5} 
                    borderTopColor='secondary'
                    borderTopWidth={5}     
                    borderBottomColor='white'
                    borderEndColor='white'         
                >
                    <Box 
                        position="absolute"
                        right={-16}
                        top={-16}
                        backgroundColor='secondary'
                        borderRadius={90}
                        padding='xs'
                        borderColor='grayOne'
                        borderWidth={1}

                        onTouchEnd={onClose}

                        
                    >
                        <FeatherIcons name="x" color="white" size={24}/>

                    </Box>

                    <Box
                        width={'100%'}
                        position='absolute'
                        bottom={10}
                        marginHorizontal='s'
                        paddingHorizontal='m'
                    >
                        <Button
                            style = {{width:'100%'}}
                            title='Pesquisar'
                        />

                    </Box>


                    <Box
                        paddingTop='s'
                        borderBottomColor='white'
                        borderBottomWidth={0.5}
                    >
                        <Typography
                            variant={'heading'}
                            color="white"
                            fontSize={20}
                            marginBottom={'s'}
                            textAlign='center'
                        >
                            PESQUISAR NO FÓRUM POR:
                        </Typography>
                    </Box>

                    <Box
                        paddingTop='m'
                        paddingHorizontal='s'
                    >
                        <Typography
                            variant='heading'
                            color="grayTwo"
                            fontSize={18}
                            marginBottom={'s'}
                            textAlign='left'
                        >   
                            Palavras-chave:
                        </Typography>

                       

                        <Input
                            borderColor='primary'
                            borderWidth={1}
                            backgroundColor='grayFive'
                        />

                    </Box>


                    <Box
                        paddingTop='m'
                        paddingHorizontal='s'
                    >
                        <Typography
                            variant='heading'
                            color="grayTwo"
                            fontSize={18}
                            marginBottom={'s'}
                            textAlign='left'
                        >
                            TAGs:
                        </Typography>
                        <Box
                            paddingTop='m'
                            paddingRight='s'
                        
                        >

                        </Box>

                    </Box>

                    <Box
                        paddingTop='m'
                        paddingRight='s'
                        
                    >
                        <Typography
                            variant='heading'
                            color="grayTwo"
                            fontSize={18}
                            marginBottom={'s'}
                            textAlign='left'
                            paddingLeft='s'
                        >
                            Semestre: 
                        </Typography>

                        <HStack 
                            paddingRight='m'
                            paddingLeft='l'
                        >
                            <Box 
                                paddingVertical='s'
                                width={'45%'} 
                                alignItems='center'    
                                backgroundColor="transparent"
                                borderRadius={10}
                                borderColor='secondary'
                                borderWidth={1}

                            >
                                <Typography
                                    variant='heading'
                                    color="secondary"
                                    fontSize={18}
                                    marginBottom={'s'}
                                    textAlign='left'
                                    
                                >
                                    Atual 
                                </Typography>
                            </Box>
                            <Box
                                paddingVertical='s'
                                width={'45%'}    
                                alignItems='center' 
                                backgroundColor="transparent"
                                borderRadius={10}
                                borderColor='secondary'
                                borderWidth={1}

                            >
                                <Typography
                                    variant='heading'
                                    color="secondary"
                                    fontSize={18}
                                    marginBottom={'s'}
                                    textAlign='left'
                                >
                                    Passados 
                                </Typography>
                            </Box>

                        </HStack>
                        
                    </Box>
                    <Box
                        paddingTop='m'
                        paddingHorizontal='s'
                    >
                        <Typography
                            variant='heading'
                            color="grayTwo"
                            fontSize={18}
                            marginBottom={'s'}
                            textAlign='left'
                        >
                            Data:
                        </Typography>
                        <Box
                            paddingTop='m'
                            paddingRight='s'
                        
                        >
                            
                        </Box>

                    </Box>







                </Box>
                

            </Modal>
        </Box>
    )
}