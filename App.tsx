import { StatusBar } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { Center, NativeBaseProvider } from 'native-base';
import { Loading } from '@/components/index';
import { THEME } from '@/theme/index';
import { Routes } from '@/routes';
import { Contexts } from '@/contexts';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={THEME}>
      <Contexts>
        <StatusBar 
          barStyle="light-content"
          backgroundColor='transparent'
          translucent
        />
        {fontsLoaded ? (
          <Routes />
        ) : (
          <Center flex={1}>
            <Loading />
          </Center>
        )}
      </Contexts>
    </NativeBaseProvider>
  );
}
