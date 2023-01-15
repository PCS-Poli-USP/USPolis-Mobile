import { Center, Heading, VStack } from "native-base";

export const Profile = () => {
  return (
    <VStack flex={1} bg='gray.700' px={8} pb={16}>
      <Center my={24}>
        <Heading color='gray.100' fontSize='xxxl' ml={4} fontFamily='heading'>USPolis</Heading>
      </Center>

      <Center>
        <Heading color='gray.100' fontSize='xl' ml={4} fontFamily='heading' mb={4}>Perfil</Heading>
      </Center>

      <Center></Center>
    </VStack>
  );
};