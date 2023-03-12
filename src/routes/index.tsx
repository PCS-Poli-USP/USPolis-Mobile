import { Loading } from "@/components"
import { useAuth } from "@/hooks"
import { Theme } from "@/theme/theme"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { useTheme } from "@shopify/restyle"

import { AppRoutes } from "./app.routes"
// import { AuthRoutes } from "./auth.routes"

export const Routes = () => {
  const { colors } = useTheme<Theme>()
  const { user, isLoadingStorageUser } = useAuth()

  const theme = DefaultTheme
  theme.colors.background = colors.graySeven

  if (isLoadingStorageUser) {
    return <Loading />
  }

  return (
    <NavigationContainer>
      <AppRoutes />
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