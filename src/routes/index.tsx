import React from 'react'
import { Theme } from '@/theme/theme'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { useTheme } from '@shopify/restyle'

import { AppRoutes } from './app.routes'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Forum } from '@/screens/Forum/Forum'
import { type IClass } from '@/dtos'
import { Platform } from 'react-native'
import { Profile, ForumContent } from '@/screens'
import { type Post } from '@/screens/Forum/Forum'

export type StackRoutesType = {
  HomeBottomTab: undefined;
  Forum: {
    sclass?: IClass
  };
  ForumContent: {
    post?: Post
    sclass?: IClass
  };
  UserProfile: undefined;
};

export const Routes = () => {
  const { colors } = useTheme<Theme>();

  const { Navigator, Screen } = createNativeStackNavigator<StackRoutesType>();

  const theme = DefaultTheme;
  theme.colors.background = colors.graySeven;

  return (
    <NavigationContainer theme={theme} >
      <Navigator screenOptions={{
        headerBackTitleVisible: false,
        headerShown: true,
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
          options={{
            headerShown: false
          }}
          name="HomeBottomTab"
          component={AppRoutes}
        />
        <Screen options={({ route }) => ({
          headerTitle: "Fórum de " + route.params.sclass?.subject_code
        })}
          name="Forum"
          component={Forum}
        />
        <Screen options={({ route }) => ({
          headerTitle: "Fórum de " + route.params.sclass?.subject_code
        })}
          name="ForumContent"
          component={ForumContent}
        />
        <Screen options={({ route }) => ({
          headerTitle: "Perfil"
        })}
          name="UserProfile"
          component={Profile}
        />
      </Navigator>
    </NavigationContainer>
  );
}
