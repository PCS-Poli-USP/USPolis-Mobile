import { StatusBar } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { Box, Loading } from '@/components/index';
import { Routes } from '@/routes';
import { Contexts } from '@/contexts';
import { QueryClient, QueryClientProvider } from 'react-query';
import Toast, { InfoToast, BaseToastProps } from 'react-native-toast-message';
import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle'

import RestyleTheme from '@/theme/theme'
import { useEffect } from 'react';
import { logger } from '@/services/logger';
import { abTestingStorage } from '@/storage/ab-testing';

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

const toastConfig = {
  info: (props: BaseToastProps) => (
    <InfoToast
      {...props}
      style={{ borderLeftColor: '#408180' }}
      text1Style={{
        fontSize: 18,
        fontWeight: "700",
        fontFamily: 'Roboto'
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: "400"
      }}
    />
  ),
};

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <QueryClientProvider client={queryClient}>
      <RestyleThemeProvider theme={RestyleTheme}>
        <Contexts>
          <StatusBar 
            barStyle="light-content"
            backgroundColor='transparent'
            translucent
          />
          {fontsLoaded ? (
            <Routes />
          ) : (
            <Box flex={1} alignItems="center" justifyContent="center">
              <Loading />
            </Box>
          )}
        </Contexts>
        <Toast config={toastConfig}/>
      </RestyleThemeProvider>
    </QueryClientProvider>
  );
}
