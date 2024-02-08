# USPolis 🏛

O aplicativo oficial da faculdade para consulta de salas de aula, matérias e mapas dos prédios.

## Funcionalidades Principais

- 🚀 **Consulta de Salas de Aula**: Descubra rapidamente onde é sua próxima aula.
- 🗺 **Mapas Interativos**: Explore os prédios da faculdade com o toque de seus dedos.
- 🔍 **Pesquisa Intuitiva**: Encontre o que precisa sem complicações.
- 📈 **Analytics com Amplitude**: Monitoramos o uso para melhorar sua experiência.
- 🎨 **UI Moderna com @shopify/restyle**: Design limpo e responsivo para todos os dispositivos.

## Como Rodar o Projeto

1. Certifique-se de ter uma conta na [Expo](https://expo.dev)
2. Crie um projeto na aba "Projects" vinculado ao seu perfil
3. Baixe o aplicativo [Expo Go](https://expo.dev/client) em seu celular
4. Clone o repositório:
    ```bash
    git clone [https://github.com/seu-repositorio/uspolis.git](https://github.com/PCS-Poli-USP/USPolis-Mobile)
    cd uspolis
    ```
5. No diretório do projeto, em app.json na linha 42 mude o projectID para o ID do projeto que você criou
6. Instale as dependências:
    ```bash
    npm install
    ```
7. Inicie o projeto:
    ```bash
    npm start
    ```
8. Leia o QR Code que irá aparecer usando o aplicativo Expo Go ou insira manualmente a url

> [!TIP]
> Caso queira usar sua própria API, na pasta "src" vá para a pasta "services" e modifique a constante  ```URL_BASE ``` no arquivo api.ts
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
1. Certifique-se de usar sua conta da [Expo](https://expo.dev)
2. Configurar as credenciais de android para tal conta: 
   * Conseguir Alias
   * Conseguir Senha
3. Logar na sua conta expo em seu terminal ``npx expo login -h``
4. Rodar ```npx eas build --profile preview --platform android``` e seguir as instruções

### iOS

A fim de realizar o deploy para a loja do iOS, os seguintes passos devem ser seguidos:
1. Certifique-se de usar sua conta da [Expo](https://expo.dev)
2. Configurar as credenciais de iOS para tal conta: 
    * Conseguir Apple ID
    * Conseguir Apple Team ID
    * Conseguir Apple Provisioning Profile
    * Conseguir Apple Push Notifications Key
    * Conseguir Apple Push Notifications Certificate

3. Logar na sua conta expo em seu terminal ``npx expo login -h``
4. Rodar ```npx eas build --profile preview --platform ios``` e seguir as instruções. Para isso você precisará de uma conta na apple connect que tenha permissões para realizar o build de aplicativos.
5. Após o build ser realizado, rodar o comando ```npx eas submit --platform ios``` e seguir as instruções. Dessa forma o build irá automaticamente para a Apple como um build válido.

## Contribuição

Sinta-se à vontade para contribuir e melhorar ainda mais nosso aplicativo. Se encontrar problemas ou tiver sugestões, abra uma Issue ou envie um Pull Request.

---

Feito com 💙 pela equipe USPolis.
