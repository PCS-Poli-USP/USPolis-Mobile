import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack'

import { SignIn, SignUp } from '@/screens'

type AuthRoutes = {
  SignIn: undefined
  SignUp: undefined
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>()

export const AuthRoutes = () => (
  <Navigator screenOptions={{ headerShown: false }}>
    <Screen name='SignIn' component={SignIn} />
    <Screen name='SignUp' component={SignUp} />
  </Navigator>
)
