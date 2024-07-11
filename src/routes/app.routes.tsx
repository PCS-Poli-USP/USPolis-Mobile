import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs'
import FeatherIcons from '@expo/vector-icons/Feather'
import { Image, Platform } from 'react-native'
import Logo from '@/assets/logo.png'

import { Home, Maps, About, MyClasses, Events } from '@/screens'
import { Building, IClass } from '@/dtos/classes'
import { Theme } from '@/theme/theme'
import { useTheme } from '@shopify/restyle'
import { Box, Typography } from '@/components'
import { logger } from '@/services/logger'
import { Forum } from '@/screens/Forum/Forum'

export type AppRoutesType = {
  Home: undefined
  Maps: {
    building?: Building
    floor?: number
  }
  MyClasses: undefined
  About: undefined
  Events: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesType>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesType>()

export const AppRoutes = () => {
  const { spacing, colors } = useTheme<Theme>()

  const iconSize = spacing.l

  const onTabPress = (routeName: string) => {
    logger.logEvent(`Clicou na tab ${routeName}`)
  }

  return (
    <Navigator
      initialRouteName={'Home'}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grayTwo,
        tabBarStyle: {
          backgroundColor: colors.graySix,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 110 : 102,
          paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.m,
          paddingTop: spacing.l,
          paddingHorizontal: spacing.l,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.graySix,
          shadowColor: 'transparent',
          height: Platform.OS === 'ios' ? 148 : 120,
        },
        headerTitleStyle: {
          color: 'white',
          fontSize: Platform.OS === 'ios' ? 28 : 20,
          fontWeight: '700',
        },
      }}
    >
      <Screen
        name="Events"
        component={Events}
        listeners={({ route }) => ({
          tabPress: () => onTabPress(route.name),
        })}
        options={{
          tabBarLabel: ({ color }) => (
            <Typography fontSize={10} style={{ color }}>
              Eventos
            </Typography>
          ),
          tabBarShowLabel: true,
          tabBarIcon: ({ color }) => (
            <FeatherIcons name="calendar" color={color} size={iconSize} />
          ),
          title: 'Eventos',
          headerLeft: () => (
            <Box ml={'m'}>
              <Image source={Logo} />
            </Box>
          ),
        }}
      />
      <Screen
        name="Home"
        component={Home}
        listeners={({ route }) => ({
          tabPress: () => onTabPress(route.name),
        })}
        options={{
          tabBarLabel: ({ color }) => (
            <Typography fontSize={10} style={{ color }}>
              Busca
            </Typography>
          ),
          tabBarShowLabel: true,
          tabBarIcon: ({ color }) => (
            <FeatherIcons name="search" color={color} size={iconSize} />
          ),
          title: 'Início',
          headerLeft: () => (
            <Box ml={'m'}>
              <Image source={Logo} />
            </Box>
          ),
        }}
      />
      <Screen
        name="MyClasses"
        component={MyClasses}
        listeners={({ route }) => ({
          tabPress: () => onTabPress(route.name),
        })}
        options={{
          tabBarLabel: ({ color }) => (
            <Typography fontSize={10} style={{ color }}>
              Minhas Aulas
            </Typography>
          ),
          tabBarShowLabel: true,
          tabBarIcon: ({ color }) => (
            <FeatherIcons name="home" color={color} size={iconSize} />
          ),
          title: 'Minhas Aulas',
        }}
      />
      <Screen
        name="Maps"
        component={Maps}
        listeners={({ route }) => ({
          tabPress: () => onTabPress(route.name),
        })}
        options={{
          tabBarLabel: ({ color }) => (
            <Typography fontSize={10} style={{ color }}>
              Mapas
            </Typography>
          ),
          tabBarShowLabel: true,
          tabBarIcon: ({ color }) => (
            <FeatherIcons name="map" color={color} size={iconSize} />
          ),
          title: 'Mapa dos Prédios da POLI',
        }}
      />
      <Screen
        name="About"
        component={About}
        listeners={({ route }) => ({
          tabPress: () => onTabPress(route.name),
        })}
        options={{
          tabBarLabel: ({ color }) => (
            <Typography fontSize={10} style={{ color }}>
              Informações
            </Typography>
          ),
          tabBarShowLabel: true,
          tabBarIcon: ({ color }) => (
            <FeatherIcons name="info" color={color} size={iconSize} />
          ),
          title: 'Sobre o USPolis',
        }}
      />
    </Navigator>
  )
}
