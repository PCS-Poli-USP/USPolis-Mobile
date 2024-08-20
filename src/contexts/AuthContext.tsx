import { type AuthResponse, type AuthUser } from '@/dtos/auth';
import api from '@/services/api';
import { EXPO_PUBLIC_AUTH_EMAIL_DOMAIN, EXPO_PUBLIC_IOS_CLIENT_ID, EXPO_PUBLIC_WEB_CLIENT_ID } from '@env';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { type AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'
import { createContext, useReducer } from 'react'

type GAuthState = {
  isLoggedIn: boolean;
  isRegisteredUser: boolean;
  authUser: AuthUser | null;
};

// type that has the GAuthState and the functions that manage them
export type GAuthContextValue = GAuthState & {
  updateLoggedIn: (isLoggedIn: boolean) => void;
  updateRegisteredUser: (isRegistered: boolean) => void;
  updateUser: (user: AuthUser | null) => void;
  silentlyLogin: () => void;
  getUserToken: () => string | null;
};

type GAuthContextProviderProps = {
  children: React.ReactNode;
};

// Initial value of createContext is null because we'll manage it elsewhere
export const GAuthContext = createContext<GAuthContextValue | null>(null);

const initialState: GAuthState = {
  isLoggedIn: false,
  isRegisteredUser: true,
  authUser: null
};

type IsLoggedInAction = {
  type: "UPDATE_LOGGED_IN";
  isLoggedIn: boolean;
}
type IsResgisterUserAction = {
  type: "UPDATE_REGISTERED_USER";
  isRegisteredUser: boolean;
};
type UserAction = {
  type: "UPDATE_USER"
  user: AuthUser | null;
};
type Action = IsLoggedInAction | IsResgisterUserAction | UserAction;
function gAuthReducer(state: GAuthState, action: Action): GAuthState {
  if (action.type === "UPDATE_LOGGED_IN") {
    const newState: GAuthState = {
      ...state, // get current state's values
      isLoggedIn: action.isLoggedIn,
    };
    console.debug("CTX Updated isLoggedIn: ", newState);
    return newState;
  } else if (action.type === "UPDATE_REGISTERED_USER") {
    const newState: GAuthState = {
      ...state, // get current state's values
      isRegisteredUser: action.isRegisteredUser,
    };
    console.debug("CTX Updated isRegistered: ", newState);
    return newState;
  } else if (action.type === "UPDATE_USER") {
    const newState: GAuthState = {
      ...state, // get current state's values
      authUser: action.user,
    };
    console.debug("CTX Updated user: ", newState);
    return newState;
  }
  return state;
};

export const GAuthContextProvider = ({ children }: GAuthContextProviderProps) => {
  /* we could use the usual useState(), but the useReducer() is more suitable for
    complex states, that may be triggered from multiple places.
    It receives a reducer function and an initialState.
    The reducer function is a function that is automatically executed  by React when 
    an action is dispatched (using the 'dispatch' return) to the Reducer, triggering 
    a change of state    */
  const [gAuthState, dispatch] = useReducer(gAuthReducer, initialState);
  const [idToken, setIdToken] = useState<string | null>(null)

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: EXPO_PUBLIC_WEB_CLIENT_ID,
      offlineAccess: true,
      iosClientId: EXPO_PUBLIC_IOS_CLIENT_ID,
      hostedDomain: EXPO_PUBLIC_AUTH_EMAIL_DOMAIN
    });
    if (GoogleSignin.hasPreviousSignIn()) {
      signInSilently();
    }
  }, []);

  const ctx: GAuthContextValue = {
    isLoggedIn: gAuthState.isLoggedIn,
    isRegisteredUser: gAuthState.isRegisteredUser,
    authUser: gAuthState.authUser,
    updateLoggedIn(isLoggedIn) {
      dispatch({ type: "UPDATE_LOGGED_IN", isLoggedIn: isLoggedIn });
    },
    updateRegisteredUser(isRegistered) {
      dispatch({ type: "UPDATE_REGISTERED_USER", isRegisteredUser: isRegistered });
    },
    updateUser(user) {
      dispatch({ type: "UPDATE_USER", user: user });
    },
    silentlyLogin() {
      signInSilently();
    },
    getUserToken() {
      return getGoogleAuthToken()
    },
  };

  function signInSilently() {
    if (GoogleSignin.hasPreviousSignIn()) {
      const silentlySignIn = async () => {
        try {
          const { idToken } = await GoogleSignin.signInSilently();
          const response = await authenticateInBackend(idToken!);
          if (response.status == 200) {
            //console.log(response);
            dispatch({ type: "UPDATE_LOGGED_IN", isLoggedIn: true });
            dispatch({ type: "UPDATE_REGISTERED_USER", isRegisteredUser: true });
            dispatch({ type: "UPDATE_USER", user: response.data.user });
          }
        } catch (err: any) {
          // -4 is user never logged in before or signed out
          if (err.code != -4) {
            console.error("Silent Signin err: ", err);
          }
          dispatch({ type: "UPDATE_REGISTERED_USER", isRegisteredUser: false });
          dispatch({ type: "UPDATE_USER", user: null });
          GoogleSignin.signOut();
        }
      };
      silentlySignIn()
    }
  }

  function getGoogleAuthToken(): string | null {
    if (GoogleSignin.hasPreviousSignIn()) {
      const fecthIdTokens = async () => {
        const { idToken } = await GoogleSignin.getTokens()
        setIdToken(idToken)
      }
      fecthIdTokens()
      return idToken
    }
    return null
  }

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

      const response = await api.post('/authentication', null, config);

      return response;
    } catch (err: any) {
      return err;
    }
  }

  return (
    <GAuthContext.Provider
      value={ctx}>
      {children}
    </GAuthContext.Provider>
  );
};
