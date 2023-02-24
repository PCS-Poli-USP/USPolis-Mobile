import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import FeatherIcons from "@expo/vector-icons/Feather";

import { Home, Maps, About, MyClasses } from "@/screens";
import { useTheme } from "native-base";
import { Platform } from "react-native";
import { Building } from "@/dtos/classes";

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
  const { sizes, colors } = useTheme();

  const iconSize = sizes[6];

  return (
    <Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 96 : 88,
          paddingBottom: sizes[10],
          paddingTop: sizes[6],
          paddingHorizontal: sizes[8],
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors["gray"][600],
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
        options={{
          tabBarIcon: ({ color }) => (
            <FeatherIcons name="home" color={color} size={iconSize} />
          ),
          title: "Início",
        }}
      />
      <Screen
        name="MyClasses"
        component={MyClasses}
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
