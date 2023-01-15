import { VStack, Image, HStack, Heading, Center, Text, Box } from 'native-base';

import BackgroundImage from '@/assets/login-background.png'
import Logo from '@/assets/logo.png'
import { Button, Input } from '@/components';
import { Layout } from '@/components/Layout';
import { useNavigation } from '@react-navigation/native';

export const SignUp = () => {
  const navigation = useNavigation()

  const handleGoToLogin = () => {
    navigation.goBack()
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


        <Center mb={24}>
          <Heading color='gray.100' fontSize='xl' ml={4} fontFamily='heading' mb={4}>Crie sua conta</Heading>
          <Input 
            placeholder='Nome'
            autoCapitalize='words'
          />
          <Box mb={4} />
          <Input 
            placeholder='E-mail'
            autoCapitalize='none'
            keyboardType='email-address'
            spellCheck={false}
          />
          <Box mb={4} />
          <Input 
            placeholder='Número USP'
            autoCapitalize='none'
            keyboardType='number-pad'
            spellCheck={false}
          />
          <Box mb={4} />
          <Button title='Criar e acessar' />
        </Center>

        <Center>
          <Button onPress={handleGoToLogin} title={'Voltar para login'} variant='outlined' />
        </Center>
      </VStack>
    </Layout>
  );
}