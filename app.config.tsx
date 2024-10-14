import { EXPO_PUBLIC_IOS_URL_SCHEME } from '@env';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "USPolis",
  slug: "uspolis",
  plugins: [
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: EXPO_PUBLIC_IOS_URL_SCHEME
      }
    ],
    "expo-font"
  ],
  ios: {
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              EXPO_PUBLIC_IOS_URL_SCHEME
            ],
          }
        ]
      }
    }
});
