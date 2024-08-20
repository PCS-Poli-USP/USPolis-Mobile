# USPolis 🏛

O aplicativo oficial da faculdade para consulta de salas de aula, matérias e mapas dos prédios.

## Funcionalidades Principais

- 🚀 **Consulta de Salas de Aula**: Descubra rapidamente onde é sua próxima aula.
- 🗺 **Mapas Interativos**: Explore os prédios da faculdade com o toque de seus dedos.
- 🔍 **Pesquisa Intuitiva**: Encontre o que precisa sem complicações.
- 📈 **Analytics com Amplitude**: Monitoramos o uso para melhorar sua experiência.
- 🎨 **UI Moderna com @shopify/restyle**: Design limpo e responsivo para todos os dispositivos.

## Como Rodar o Projeto

1. Certifique-se de ter o [Expo CLI](https://expo.dev/tools/cli) instalado.
2. Clone o repositório:
    ```bash
    git clone [https://github.com/seu-repositorio/uspolis.git](https://github.com/PCS-Poli-USP/USPolis-Mobile)
    cd uspolis
    ```
3. Instale as dependências:
    ```bash
    npm install
    ```
4. Obtenha o .env (no drive de desenvolvedores do USPolis) ou obtenha as credenciais necessárias para o [Google Authentication](https://react-native-google-signin.github.io/docs/setting-up/get-config-file) (sem Firebase)
5. Inicie o projeto:
    ```bash
    npm start
    ```

## Estrutura do Projeto

```plaintext
src/
│
├── @types/              # Tipos TypeScript globais e declarações.
├── assets/              # Recursos como imagens e ícones.
├── components/          # Componentes reutilizáveis.
├── contexts/            # Contextos do React para gerenciamento de estados.
├── dtos/                # Data Transfer Objects para formas consistentes de dados.
├── hooks/               # Hooks personalizados.
├── routes/              # Configuração das rotas e navegação.
├── screens/             # Telas ou páginas do aplicativo.
├── services/            # Serviços, como chamadas API.
├── storage/             # Manipulação de armazenamento persistente.
├── tests/               # Testes unitários e de integração, além dos mocks para esses testes.
├── theme/               # Estilização global e temas.
└── utils/               # Funções utilitárias.
```

## Tecnologias e Bibliotecas

- 📊 **Analytics**: `@amplitude/analytics-react-native`
- ✒️ **Fontes**: `@expo-google-fonts/roboto`
- 🗺 **Mapas Zoom**: `@openspacelabs/react-native-zoomable-view`
- 🗂 **Navegação**: `@react-navigation`
- 🖌 **UI**: `@shopify/restyle`
- 🕸️ **Requisições**: `axios`
- 📆 **Manipulação de Datas**: `date-fns`
- 🖼️ **UI/UX**: `react-native-modal`, `react-native-toast-message`
- 📦 **Armazenamento**: `@react-native-async-storage/async-storage`
- 📝 **Validação**: `yup`, `react-hook-form`

> ⚠️ Nota: Estamos transitando de `native-base` para `@shopify/restyle` para estilização. Por favor, evite usar `native-base` em novos desenvolvimentos.

## Deploy para as Lojas

### Android

A fim de realizar o deploy para a loja do android, os seguintes passos devem ser seguidos:
1. Criar uma conta em http://expo.dev ou utilize a conta do USPolis (nesse caso, pode pular para o item 3)
2. Configurar as credenciais de android para tal conta: 
    
    2.1 Conseguir Alias

    2.2 Conseguir Senha
3. Logar na conta expo em seu terminar ``npx expo login -h``
3. Rodar ```npx eas build --profile production --platform android``` e seguir as instruções

### iOS

A fim de realizar o deploy para a loja do iOS, os seguintes passos devem ser seguidos:
1. Criar uma conta em http://expo.dev ou utilize a conta do USPolis (nesse caso, pode pular para o item 3)
2. Configurar as credenciais de iOS para tal conta: 
    
    2.1 Conseguir Apple ID
    
    2.2 Conseguir Apple Team ID
    
    2.3 Conseguir Apple Provisioning Profile
    
    2.4 Conseguir Apple Push Notifications Key
    
    2.5 Conseguir Apple Push Notifications Certificate

3. Logar na conta expo em seu terminal ``npx expo login -h``
3. Rodar ```npx eas build --profile production --platform ios``` e seguir as instruções. Para isso você precisará de uma conta na apple connect que tenha permissões para realizar o build de aplicativos.
4. Após o build ser realizado, rodar o comando ```npx eas submit --platform ios``` e seguir as instruções. Dessa forma o build irá automaticamente para a Apple como um build válido.

## Contribuição

Sinta-se à vontade para contribuir e melhorar ainda mais nosso aplicativo. Se encontrar problemas ou tiver sugestões, abra uma Issue ou envie um Pull Request.

---

Feito com 💙 pela equipe USPolis.