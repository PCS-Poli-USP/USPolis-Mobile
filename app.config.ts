import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Uspolis",
    slug: "Uspolis",
    plugins: [
        [
          "@react-native-google-signin/google-signin",
          {
            iosUrlScheme: process.env.EXPO_PUBLIC_IOS_URL_SCHEME
          }
        ],
        "expo-font"
      ],
});
