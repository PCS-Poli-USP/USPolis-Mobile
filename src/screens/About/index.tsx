import {
  Layout,
  VStack,
  Input,
  Button,
  Typography,
  TextArea,
  Box,
} from "@/components";
import { useState } from "react";
import { IComment } from "@/dtos";
import api from "@/services/api";

export const About = () => {
  const [comment, setComment] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendComment = async () => {
    setIsLoading(true);
    const formData: IComment = {
      comment,
    };

    if (email.length > 0) {
      formData.email = email;
    }

    try {
      await api.post("/comments", formData);
      // toast.show({
      //   title: "Muito obrigado!",
      //   description: "Seu comentário foi enviado.",
      //   placement: "bottom",
      // });
      setComment("");
      setEmail("");
    } catch (e) {
      // toast.show({
      //   title: "Ops!",
      //   description: "Ocorreu um erro, tente novamente mais tarde.",
      //   placement: "bottom",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <VStack bg="graySeven" paddingBottom="l" paddingHorizontal="m">
        <Typography
          color="grayTwo"
          marginTop="l"
          textAlign="justify"
          fontSize={16}
          lineHeight={23}
        >
          O USPolis foi desenvolvido como projeto de formatura no PCS, contando
          com um sistema de alocação automático de salas e este aplicativo para
          sua visualização pelos alunos da faculdade.
        </Typography>
        <Box marginTop="m">
          <Typography
            color="grayTwo"
            variant="heading"
            fontSize={16}
            lineHeight={23}
          >
            Desenvolvedores:
          </Typography>
          <Typography color="grayTwo" fontSize={16} lineHeight={23}>
            {"\u2022"} Jorge Habib El Khouri
          </Typography>
          <Typography color="grayTwo" fontSize={16} lineHeight={23}>
            {"\u2022"} Luiz Roberto Akio Higuti
          </Typography>
          <Typography color="grayTwo" fontSize={16} lineHeight={23}>
            {"\u2022"} Marcel Makoto Kondo
          </Typography>
          <Typography color="grayTwo" fontSize={16} lineHeight={23}>
            {"\u2022"} Rodrigo Kenji Aguena
          </Typography>
          <Typography color="grayTwo" fontSize={16} lineHeight={23}>
            {"\u2022"} Rodrigo Miksian Magaldi
          </Typography>
        </Box>
        <Box marginTop="m">
          <Typography
            color="grayTwo"
            variant="heading"
            fontSize={16}
            lineHeight={23}
          >
            Orientação:
          </Typography>
          <Typography color="grayTwo" fontSize={16} lineHeight={23}>
            {`\u2022`} Prof. Fábio Levy Siqueira (PCS | Poli-USP)
          </Typography>
          <Typography color="grayTwo" fontSize={16} lineHeight={23}>
            {`\u2022`} Renan Ávila (criador original do USPolis)
          </Typography>
        </Box>

        <Typography
          color="grayTwo"
          marginTop="m"
          marginBottom="xl"
          textAlign="justify"
          fontSize={16}
          lineHeight={23}
        >
          Quaisquer dúvidas, sugestões ou comentários são mais do que bem
          vindos!
        </Typography>
        <Typography color="grayTwo" variant="heading" fontSize={16}>
          Comentário
        </Typography>
        <TextArea
          marginTop="s"
          marginBottom="m"
          variation="secondary"
          placeholder="Deixe seu comentário"
          value={comment}
          onChangeText={(text) => setComment(text)}
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
