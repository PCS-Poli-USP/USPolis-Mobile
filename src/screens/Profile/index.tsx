import { Box, Button, Typography, VStack } from "@/components";
import React, { useEffect, useState } from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  User,
} from "@react-native-google-signin/google-signin";
import api from "@/services/api";
import Toast from "react-native-toast-message";
import { AxiosResponse } from "axios";

export const Profile = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setuserInfo] = useState([]);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const response = await authenticateInBackend(idToken!);
      if (response.status == 200) {
        console.log(response)
        setLoggedIn(true);
      } else {
        signOut()
      }
      console.log(userInfo)
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
      } else {
        // algum outro erro ocorreu
        console.log("Outro erro :( ", error, error.code, statusCodes.SIGN_IN_REQUIRED)
      }
    }
  };

  async function silentlyLogin() {
    const { idToken } = await GoogleSignin.signInSilently()
    const response = await authenticateInBackend(idToken!);
    if (response.status == 200) {
        console.log(response)
        setLoggedIn(true);
    }
  }
  useEffect(() => {
    console.log("refreshed (remove me!)")
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      offlineAccess: true,
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID
    }
    );
    try {
      silentlyLogin()
    } catch(err: any) {
      console
    }
  }, []);
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setLoggedIn(false);
      setuserInfo([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VStack flex={1} backgroundColor='graySeven' paddingHorizontal="m" paddingBottom={'l'}>
      <Box marginVertical="l" alignItems="center" justifyContent="center">
        <Typography variant={'heading'} color='grayOne' fontSize={24} ml={'s'}>Login</Typography>
      </Box>

      <VStack flex={1} backgroundColor='graySeven' paddingHorizontal="m" paddingBottom={'l'}>
        <Box marginVertical="l" alignItems="center" justifyContent="center">
          {!loggedIn && <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
          />}
        </Box>
        {!loggedIn && <Typography variant={'heading'} color='grayOne' fontSize={24} ml={'s'}>Você atualmente não está logado</Typography>}
        {loggedIn && (
          <Button
            onPress={signOut}
            title="LogOut"></Button>
        )}
      </VStack>
    </VStack>
  );
};

async function authenticateInBackend(idToken: string): Promise<AxiosResponse> {
  try {
    let config = {
      headers: {
        "idToken": idToken,
      }
    }

    // TODO: for debugging: remove!
    api.interceptors.request.use(request => {
      console.log('Starting Request', JSON.stringify(request, null, 2))
      return request
    })
    const response = await api.post('/authentication', null, config);
    Toast.show({
      type: 'info',
      text1: 'Login efetuado com sucesso'
    });
    return response
  } catch (err: any) {
    Toast.show({
      type: 'error',
      text1: 'Ops!',
      text2: 'Ocorreu um erro, tente novamente mais tarde.' + { err }
    });
    return err
  }
}
