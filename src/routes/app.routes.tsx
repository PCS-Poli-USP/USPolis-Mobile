import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import FeatherIcons from "@expo/vector-icons/Feather";
import { Image } from "react-native";
import Logo from '@/assets/logo.png'

import { Home, Maps, About, MyClasses } from "@/screens";
import { Platform } from "react-native";
import { Building } from "@/dtos/classes";
import { Theme } from "@/theme/theme";
import { useTheme } from "@shopify/restyle";
import { Box } from "@/components";
import { logger } from "@/services/logger";

export type AppRoutesType = {
  Home: undefined;
  Maps: {
    building?: Building;
    floor?: number;
  };
  MyClasses: undefined;
  About: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesType>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesType>();

export const AppRoutes = () => {
  const { spacing, colors } = useTheme<Theme>();

  const iconSize = spacing.l;

  const onTabPress = (routeName: string) => {
    logger.logEvent(`Clicou na tab ${routeName}`)
  }

  return (
    <Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grayTwo,
        tabBarStyle: {
          backgroundColor: colors.graySix,
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 96 : 88,
          paddingBottom: spacing.xl,
          paddingTop: spacing.l,
          paddingHorizontal: spacing.l,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.graySix,
          shadowColor: "transparent",
          height: Platform.OS === "ios" ? 148 : 120,
        },
        headerTitleStyle: {
          color: "white",
          fontSize: Platform.OS === "ios" ? 28 : 20,
          fontWeight: "700",
        },
      }}
    >
      <Screen
        name="Home"
        component={Home}
        listeners={({ route }) => ({
          tabPress: () => onTabPress(route.name),
        })}
        options={{
          tabBarIcon: ({ color }) => (
            <FeatherIcons name="home" color={color} size={iconSize} />
          ),
          title: "Início",
          headerLeft: () => (
          <Box ml={'m'}>
            <Image source={Logo} />
          </Box>
          )
        }}
      />
      <Screen
        name="MyClasses"
        component={MyClasses}
        listeners={({ route }) => ({
          tabPress: () => onTabPress(route.name),
        })}
        options={{
          tabBarIcon: ({ color }) => (
            <FeatherIcons name="book-open" color={color} size={iconSize} />
          ),
          title: "Minhas Aulas",
        }}
      />
      <Screen
        name="Maps"
        component={Maps}
        listeners={({ route }) => ({
          tabPress: () => onTabPress(route.name),
        })}
        options={{
          tabBarIcon: ({ color }) => (
            <FeatherIcons name="map" color={color} size={iconSize} />
          ),
          title: "Mapa dos Prédios da POLI",
        }}
      />
      <Screen
        name="About"
        component={About}
        listeners={({ route }) => ({
          tabPress: () => onTabPress(route.name),
        })}
        options={{
          tabBarIcon: ({ color }) => (
            <FeatherIcons name="info" color={color} size={iconSize} />
          ),
          title: "Sobre o USPolis",
        }}
      />
    </Navigator>
  );
};
