import { VStack, Text } from "native-base";
import Toast from 'react-native-toast-message';

import { Layout, TextArea, Input, Button } from "@/components";

import { useState } from "react";
import { IComment } from "@/dtos";
import api from "@/services/api";

export const About = () => {
  const [comment, setComment] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false)

  const handleSendComment = async () => {
    setIsLoading(true)
    const formData: IComment = {
      comment
    }
    
    if (email.length > 0) {
      formData.email = email
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
      setIsLoading(false)
    }
  }

  const Bold = (props: any) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

  return (
    <Layout>
      <VStack flex={1} bg="gray.700" pb={16} px={8}>
        <Text color="gray.200" mt={2} mb={5} textAlign={'justify'} marginTop={5}>
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
        </Text>
        
        <Text color="gray.200" fontWeight={"bold"} fontSize={16}>
          Comentário
        </Text>
        <TextArea
          mt={2}
          mb={5}
          variation="secondary"
          placeholder="Deixe seu comentário"
          value={comment}
          onChangeText={(text) => setComment(text)}
        />

        <Text color="gray.200" fontWeight={"bold"} fontSize={16}>
          Seu email (opcional)
        </Text>
        <Input
          mt={2}
          mb={10}
          variation="secondary"
          placeholder="Seu email"
          keyboardType='email-address'
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <Button 
          title="Enviar comentário"
          onPress={handleSendComment}
          isDisabled={comment.length === 0}
          isLoading={isLoading}
        />

      </VStack>
    </Layout>
  );
};
