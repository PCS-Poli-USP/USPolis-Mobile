import { Box, Button, Typography, VStack } from "@/components";
import React, { useEffect } from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useGoogleAuthContext } from "@/hooks/useAuth";
import api from "@/services/api";
import Toast from "react-native-toast-message";
import { AuthResponse } from "@/dtos/auth";
import { AxiosResponse } from "axios";
import  Logo from "@/assets/logo.png"
import { Image, Platform, Dimensions  } from 'react-native'
import FeatherIcons from '@expo/vector-icons/Feather'
import { Center } from "native-base";


export const Profile = () => {
  const { authUser, isLoggedIn, isRegisteredUser, updateLoggedIn, updateRegisteredUser, updateUser } = useGoogleAuthContext();
  const { width } = Dimensions.get('window');
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      offlineAccess: true,
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID
    });
    silentlySignIn();
  }, []);

  async function signIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const response = await authenticateInBackend(idToken!);
      if (response.status == 200) {
        //console.log(response);
        updateLoggedIn(true);
        updateRegisteredUser(true);
        updateUser(response.data.user);
      } else if (response.status == 404) {
        //console.log("recebeu 404");
        signOut();
        updateRegisteredUser(false);
      } else {
        //console.log("sign in: sign out")
        signOut();
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // usuário cancelou o fluxo de login
        console.log('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signin in progress');
        // operação (por exemplo, o login) já está em andamento
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
        // serviços de execução não disponível ou desatualizado
      }else if (error.code === "12500"){
        // 12500 -> wrong domain code
        Toast.show({
          type: 'info',
          text1: 'Domínio Errado!',
          text2: "Use um e-mail USP para continuar"
        });
      } else {
        // algum outro erro ocorreu
        console.log("Outro erro :( ", error.code, error)
      }
    }
  }

  const registerUser = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const response = await createUserInBackend(idToken!);
      if (response.status == 200) {
        //console.log(response);
        updateLoggedIn(true);
        updateRegisteredUser(true);
        updateUser(response.data.user);
      } else {
        signOut();
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // usuário cancelou o fluxo de login
        console.log('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signin in progress');
        // operação (por exemplo, o login) já está em andamento
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
        // serviços de execução não disponível ou desatualizado
      } else if (error.code === "12500"){
        // 12500 -> wrong e-mail domain code
        Toast.show({
          type: 'info',
          text1: 'Domínio Errado!',
          text2: "Use um e-mail USP para continuar"
        });
      } else {
        // algum outro erro ocorreu
        console.log("Outro erro :( ", error.code, error)
      }
    }
  }

  const silentlySignIn = async () => {
    try {
      const { idToken } = await GoogleSignin.signInSilently();
      const response = await authenticateInBackend(idToken!);
      if (response.status == 200) {
        //console.log(response);
        updateLoggedIn(true);
        updateRegisteredUser(true);
        updateUser(response.data.user);
      }
    } catch (err: any) {
      console.error("Silent Signin err: ",err);
      updateLoggedIn(false);
      updateUser(null);
    }
  };
  
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      updateLoggedIn(false);
      updateUser(null)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VStack 
      flex={1} 
      backgroundColor='graySeven' 
      paddingHorizontal="m" 
      paddingVertical={'l'}
      alignItems="center"
      justifyContent="center"
    >
      <Box width={width * 0.8}marginBottom="s"  marginHorizontal="l"  justifyContent="center" backgroundColor="graySix">
        <Box justifyContent="center" alignItems="center" borderRadius={90} marginVertical="m">
          {isLoggedIn?
          <Box >
            <Typography 
              variant={'heading'}  
              color='grayOne' 
              textAlign="center" 
              fontSize={16} ml={'s'} 
              marginBottom="m"
            >
              Você está logado como:
            </Typography>

            <Box  alignContent="center" alignItems="center">
              <Image  
                style={{ width: 120, height: 120, borderRadius:90 }} 
                source={ {uri:authUser?.picture_url}} />
            </Box>

          </Box>
          : 
            <Box  
              justifyContent="center" 
              alignItems="center" 
              width={120} 
              height={120} 
              borderRadius={90} 
              backgroundColor="grayOne"
              
            >
              <FeatherIcons name="user" color="graySeven" size={100} />
            </Box>
          }
        </Box>
        <Box paddingTop="s" paddingBottom="m" alignItems="center" justifyContent="center">
          {!isLoggedIn?
            <Box alignContent="flex-end">

              <Typography variant={'heading'} color='grayOne' textAlign="center" marginBottom="s" fontSize={16} ml={'s'}>Você ainda não está logado</Typography>
              <Typography variant={'heading'} color='grayOne' textAlign="center" fontSize={16} ml={'s'}>Clique no botão abaixo para entrar com o <Typography color="white">e-mail USP</Typography></Typography>
            

              <Box marginVertical="l" alignItems="center" justifyContent="center">
                {!isLoggedIn && isRegisteredUser && 
                <GoogleSigninButton
                  style={{ width: 192, height: 48 }}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={signIn} />}
                {!isLoggedIn && !isRegisteredUser && <GoogleSigninButton
                  style={{ width: 192, height: 48 }}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={registerUser} />}
              </Box>
            </Box>
            :
            <VStack alignContent="center" alignItems="center">
              <Typography variant={'heading'} textAlign="center" color='grayOne' fontSize={20} ml={'s'} marginBottom="l" >
                {authUser?.given_name + " " + authUser?.family_name}
              </Typography>
              <Box  flexDirection="row" justifyContent="space-around">

                <Button
                  style={{width:200, margin: 10}}
                  variant="outlined"
                  onPress={signOut}
                  title="Logout"
                />
              </Box>
                
            </VStack>
          }
        </Box>
      
      </Box>
    </VStack>
  );
};

async function authenticateInBackend(idToken: string): Promise<AxiosResponse<AuthResponse>> {
  try {
    let config = {
      headers: {
        "idToken": idToken,
      },
      validateStatus: function (status: number) {
        return status <= 500; // Resolve only if the status code is less than 500
      }
    };
    // TODO: for debugging: remove!
    /*api.interceptors.request.use(request => {
      console.log('Starting Request', JSON.stringify(request, null, 2))
      return request
    })*/
    const response = await api.post('/authentication', null, config);

    if (response.status == 200) {
      Toast.show({
        type: 'info',
        text1: 'Login efetuado com sucesso!'
      });
    } else if (response.status == 404) {
      Toast.show({
        type: 'info',
        text1: 'Usuário não encontrado',
        text2: "por favor cadastre-se"
      });
    }
    return response;
  } catch (err: any) {
    Toast.show({
      type: 'error',
      text1: 'Ops!',
      text2: 'Ocorreu um erro, tente novamente mais tarde.' + { err }
    });
    return err;
  }
}

async function createUserInBackend(idToken: string): Promise<AxiosResponse<AuthResponse>> {
  try {
    let config = {
      headers: {
        "idToken": idToken,
      }
    };
    // TODO: for debugging: remove!
    /*api.interceptors.request.use(request => {
      console.log('Starting Request', JSON.stringify(request, null, 2))
      return request
    })*/
    const response = await api.post('/authentication/new-user', null, config);
    Toast.show({
      type: 'info',
      text1: 'Cadastro efetuado com sucesso!'
    });
    return response;
  } catch (err: any) {
    Toast.show({
      type: 'error',
      text1: 'Ops!',
      text2: 'Ocorreu um erro, tente novamente mais tarde.' + { err }
    });
    return err;
  }
}
