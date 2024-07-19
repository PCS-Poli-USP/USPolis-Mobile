import { AuthUser } from '@/dtos/auth';
import React from 'react'
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
}

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
  return state
};

export const GAuthContextProvider = ({ children }: GAuthContextProviderProps) => {
  /* we could use the usual useState(), but the useReducer() is more suitable for
    complex states, that may be triggered from multiple places.
    It receives a reducer function and an initialState.
    The reducer function is a function that is automatically executed  by React when 
    an action is dispatched (using the 'dispatch' return) to the Reducer, triggering 
    a change of state    */
    const [gAuthState, dispatch] = useReducer(gAuthReducer, initialState);

  const ctx: GAuthContextValue = {
    isLoggedIn: gAuthState.isLoggedIn,
    isRegisteredUser: gAuthState.isRegisteredUser,
    authUser: gAuthState.authUser,
    updateLoggedIn(isLoggedIn) {
      dispatch({type: "UPDATE_LOGGED_IN", isLoggedIn: isLoggedIn})
    },
    updateRegisteredUser(isRegistered) {
      dispatch({type: "UPDATE_REGISTERED_USER", isRegisteredUser: isRegistered})
    },
    updateUser(user) {
      dispatch({type: "UPDATE_USER", user: user})
    },
  };

  return (
    <GAuthContext.Provider
      value={ctx}>
      {children}
    </GAuthContext.Provider>
  )
};
