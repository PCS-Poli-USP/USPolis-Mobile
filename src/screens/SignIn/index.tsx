import { VStack, Image, HStack, Heading, Center, Text, Box } from 'native-base';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import BackgroundImage from '@/assets/login-background.png'
import Logo from '@/assets/logo.png'
import { Button, Input } from '@/components';
import { Layout } from '@/components/Layout';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@/routes/auth.routes';
import { useAuth } from '@/hooks';
import { Controller, useForm } from 'react-hook-form';
import React from 'react';

type SignInFormProps = {
  name: string
  email: string
}

const signInSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido')
})

export const SignIn = () => {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const { handleSignIn } = useAuth()
  const { control, handleSubmit, formState: { errors } } = useForm<SignInFormProps>({
    defaultValues: {
      name: '',
      email: ''
    },
    resolver: yupResolver(signInSchema),
  })

  const signIn = (data: SignInFormProps) => {
    handleSignIn({
      name: data.name,
    })
  }

  return (
    <Layout>
      <VStack flex={1} bg='gray.700' px={8} pb={16}>
        <Image 
          source={BackgroundImage} 
          defaultSource={BackgroundImage}
          alt='Pessoa estudando' 
          resizeMode='contain'
          position='absolute'
        />

        <Center my={24}>
          <HStack alignItems={'center'} mb={4}>
            <Image 
              source={Logo}
              alt='USPolis Logo'
              resizeMode='contain'
            />
            <Heading color='gray.100' fontSize='xxxl' ml={4} fontFamily='heading'>USPolis</Heading>
          </HStack>
          <Text color='gray.100' w='50%' textAlign='center'>Encontre todas as informações das aulas da Poli</Text>
        </Center>


        <Center>
          <Heading color='gray.100' fontSize='xl' ml={4} fontFamily='heading' mb={4}>Acesse sua conta</Heading>
          <Controller 
            control={control}
            name='name'
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Nome'
                autoCapitalize='words'
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Box mb={4} />
          <Controller 
            control={control}
            name='email'
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='E-mail'
                autoCapitalize='none'
                keyboardType='email-address'
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Box mb={4} />
          <Button title='Acessar' onPress={handleSubmit(signIn)}/>
        </Center>

        {/* TODO: enable when we decide about the signup flow */}
        {/* <Center mt={24}>
          <Text color='white'>Ainda não tem acesso?</Text>
          <Box mb={4}/>
          <Button onPress={() => navigation.navigate('SignUp')} title='Cadastre-se' variant='outlined' />
        </Center> */}
      </VStack>
    </Layout>
  );
}