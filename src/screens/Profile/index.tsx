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

export const Profile = () => {
  const { authUser, isLoggedIn, isRegisteredUser, updateLoggedIn, updateRegisteredUser, updateUser } = useGoogleAuthContext();

  useEffect(() => {
    console.log("Auth context refreshed (remove me!)");
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
    <VStack flex={1} backgroundColor='graySeven' paddingHorizontal="m" paddingBottom={'l'}>
      <Box marginVertical="l" alignItems="center" justifyContent="center">
        <Typography variant={'heading'} color='grayOne' fontSize={24} ml={'s'}>{isRegisteredUser ? "Login" : "Cadastro"}</Typography>
      </Box>

      <VStack flex={1} backgroundColor='graySeven' paddingHorizontal="m" paddingBottom={'l'}>
        <Box marginVertical="l" alignItems="center" justifyContent="center">
          {!isLoggedIn && isRegisteredUser && <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn} />}
          {!isLoggedIn && !isRegisteredUser && <GoogleSigninButton
            style={{ width: 48, height: 48 }}
            size={GoogleSigninButton.Size.Icon}
            color={GoogleSigninButton.Color.Dark}
            onPress={registerUser} />}
        </Box>
        {!isLoggedIn && <Typography variant={'heading'} color='grayOne' fontSize={24} ml={'s'}>Você atualmente não está logado</Typography>}
        {isLoggedIn && (<VStack>
          <Typography variant={'heading'} color='grayOne' fontSize={24} ml={'s'}>Bem vindo,</Typography>
          <Typography variant={'heading'} color='grayOne' fontSize={24} ml={'s'} marginBottom="l" >{authUser?.given_name + " " + authUser?.family_name}</Typography>
          <Button
            variant="outlined"
            onPress={signOut}
            title="Logout"></Button>
        </VStack>)}
      </VStack>
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
