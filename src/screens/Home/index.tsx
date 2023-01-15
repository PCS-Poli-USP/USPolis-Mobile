import { Layout } from "@/components";
import { Center, Heading, VStack } from "native-base";
import { HomeHeader } from "./HomeHeader";

export const Home = () => {
  return (
    <Layout>
      <VStack flex={1} bg='gray.700' pb={16}>
        <HomeHeader />
        <Center my={24}>
          <Heading color='gray.100' fontSize='xxxl' ml={4} fontFamily='heading'>USPolis</Heading>
        </Center>

        <Center>
          <Heading color='gray.100' fontSize='xl' ml={4} fontFamily='heading' mb={4}>Home</Heading>
        </Center>

        <Center></Center>
      </VStack>
    </Layout>
  );
};