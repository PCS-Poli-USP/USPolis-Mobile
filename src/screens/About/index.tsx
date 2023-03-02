import { VStack, Text, useToast } from "native-base";

import { Layout, TextArea, Input, Button } from "@/components";

import { useState } from "react";
import { IComment } from "@/dtos";
import api from "@/services/api";

export const About = () => {
  const [comment, setComment] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast();

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
      toast.show({
        title: "Muito obrigado!",
        description: "Seu comentário foi enviado.",
        placement: "bottom"
      })
      setComment("")
      setEmail("")
    } catch (e) {
      toast.show({
        title: "Ops!",
        description: "Ocorreu um erro, tente novamente mais tarde.",
        placement: "bottom"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <VStack flex={1} bg="gray.700" pb={16} px={8}>
        <Text color="gray.200" mt={2} mb={5} textAlign={'justify'} marginTop={5}>
          O aplicativo é o projeto de formatura de um grupo do PCS formado por{" "}
          <Text fontWeight={"bold"}>Jorge Habib</Text>,{" "}
          <Text fontWeight={"bold"}>Rodrigo Aguena</Text> e{" "}
          <Text fontWeight={"bold"}>Rodrigo Magaldi</Text>,{" "}
          sob orientação do <Text fontWeight={"bold"}>Prof. Fábio Levy</Text> e{" "}
          <Text fontWeight={"bold"}>Renan Ávila</Text>, criador original do USPolis.
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
