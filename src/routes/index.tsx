import { Loading } from '@/components'
import { useAuth } from '@/hooks'
import { Theme } from '@/theme/theme'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { useTheme } from '@shopify/restyle'

import { AppRoutes, AppRoutesType } from './app.routes'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Forum } from '@/screens/Forum/Forum'
import { type IClass } from '@/dtos'
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
    <NavigationContainer>
      <Navigator>
        <Screen
          name="HomeStack"
          component={AppRoutes}
        />
        <Screen
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
