import Toast from 'react-native-toast-message';

import { Layout, TextArea, Input, Button, VStack, Typography } from "@/components";

import { useState } from "react";
import { IComment } from "@/dtos";
import api from "@/services/api";
import { Theme } from "@/theme/theme";
import { useTheme } from '@shopify/restyle';

export const About = () => {
  const [comment, setComment] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { colors } = useTheme<Theme>();

  const handleSendComment = async () => {
    setIsLoading(true);
    const formData: IComment = {
      comment,
    };

    if (email.length > 0) {
      formData.email = email;
    }

    try {
      await api.post('/comments', formData)
      Toast.show({
        type: 'info',
        text1: 'Muito obrigado!',
        text2: 'Seu comentário foi enviado.'
      });
      setComment("")
      setEmail("")
    } catch (e) {
      Toast.show({
        type: 'info',
        text1: 'Ops!',
        text2: 'Ocorreu um erro, tente novamente mais tarde.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const Bold = (props: any) => <Typography fontWeight='bold'>{props.children}</Typography>

  return (
    <Layout>
      <VStack flex={1} backgroundColor="graySeven" paddingBottom={'m'} paddingHorizontal={'m'}>
        <Typography color="grayTwo" mt={'xs'} mb={'s'} textAlign={'justify'} marginTop={'m'}>
          O USPolis foi desenvolvido como projeto de formatura no PCS,
          contando com um sistema de alocação automático de salas e este
          aplicativo para sua visualização pelos alunos da faculdade.{"\n"}
          {"\n"}
          <Bold>Desenvolvedores:</Bold>{"\n"}
            {`\u2022`} Jorge Habib El Khouri{"\n"}
            {`\u2022`} Luiz Roberto Akio Higuti{"\n"}
            {`\u2022`} Marcel Makoto Kondo{"\n"}
            {`\u2022`} Rodrigo Kenji Aguena{"\n"}
            {`\u2022`} Rodrigo Miksian Magaldi{"\n"}
          {"\n"}
          <Bold>Orientação:</Bold>{"\n"}
            {`\u2022`} Prof. Fábio Levy Siqueira (PCS | Poli-USP){"\n"}
            {`\u2022`} Renan Ávila (criador original do USPolis) {"\n"}
          {"\n"}
          Quaisquer dúvidas, sugestões ou comentários são mais do que bem vindos!
        </Typography>
        
        <Typography color="grayTwo" fontWeight={"bold"} fontSize={16}>
          Comentário
        </Typography>
        <TextArea
          marginTop="s"
          marginBottom="m"
          variation="secondary"
          placeholder="Deixe seu comentário"
          placeholderTextColor={colors.grayThree}
          value={comment}
          onChangeText={(text) => setComment(text)}
          textAlignVertical="top"
          paddingTop="s"
        />
        <Typography color="grayTwo" variant="heading" fontSize={16}>
          Seu email (opcional)
        </Typography>
        <Input
          marginTop="s"
          marginBottom="m"
          variation="secondary"
          placeholder="Seu email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Button
          title="Enviar comentário"
          onPress={handleSendComment}
          disabled={!comment.length}
          isLoading={isLoading}
        />
      </VStack>
    </Layout>
  );
};
