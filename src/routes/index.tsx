import { Loading } from '@/components'
import { useAuth } from '@/hooks'
import { Theme } from '@/theme/theme'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { useTheme } from '@shopify/restyle'

import { AppRoutes, AppRoutesType } from './app.routes'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Forum } from '@/screens/Forum/Forum'
import { type IClass } from '@/dtos'
import { Platform } from 'react-native'
import { Header } from 'react-native/Libraries/NewAppScreen'
// import { AuthRoutes } from "./auth.routes"

export type StackRoutesType = {
  HomeStack: undefined;
  Forum: {
    sclass?: IClass
  }
};

export const Routes = () => {
  const { colors } = useTheme<Theme>()
  const { user, isLoadingStorageUser } = useAuth()

  const { Navigator, Screen } = createNativeStackNavigator<StackRoutesType>();

  const theme = DefaultTheme
  theme.colors.background = colors.graySeven

  if (isLoadingStorageUser) {
    return <Loading />
  }

  return (
    <NavigationContainer theme={theme} >
      <Navigator screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.graySix,
        },
        headerTitleStyle: {
          color: colors.white,
          fontSize: Platform.OS === 'ios' ? 28 : 20,
          fontWeight: '700',
        },
        headerTintColor: colors.white,
        }} >
        <Screen 
          name="HomeStack"
          component={AppRoutes}
        />
        <Screen options={({route}) => ({
          headerShown: true,
          headerTitle: "Forum de "+route.params.sclass?.subject_code
        })}
          name="Forum"
          component={Forum}
        />
      </Navigator>
    </NavigationContainer>
  )

  // return (
  //   <Box flex={1} bg='gray.700'>
  //     <NavigationContainer>
  //       {user?.id ? <AppRoutes /> : <AuthRoutes />}
  //     </NavigationContainer>
  //   </Box>
  // )
}
