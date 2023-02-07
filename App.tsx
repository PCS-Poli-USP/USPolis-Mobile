import { StatusBar } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { Center, NativeBaseProvider } from 'native-base';
import { Loading } from '@/components/index';
import { THEME } from '@/theme/index';
import { Routes } from '@/routes';
import { Contexts } from '@/contexts';
import { QueryClient, QueryClientProvider } from 'react-query';
import { setupUseClasses } from '@/tests/mocks/setupUseClasses';

if (__DEV__) {
  /**
   * Aqui dentro você pode definir alguns mocks para agilizar desenvolvimento
   * Imagina que você que reproduzir Um cenário onde você tem determinado dado vindo de uma API
   * ou determinado código de erro e você quer testar o comportamento do app.
   * você pode fazer essa alteração no banco/backend, ou criar um caso de mock para aquele endpoint,
   * com isso você consegue qualquer retorno para qualquer API
   * e.g: Quer testar um caso de erro 404 em alguma api? 'setupUseAlgumaApi (e => e.error404)
   * PS: é ideal que você remova esses mocks para mergear na branch principal, afinal você
   * não quer causar um comportamento inesperado no ambiente de desenvolvimento de ninguém
   */

  // setupUseClasses(e => e.default)
}

const queryClient = new QueryClient()

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
