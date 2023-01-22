import { Center, Heading, VStack } from "native-base";
import { useClasses } from "@/hooks/react-query/useClasses";

import { Layout, BuildingFilter, Input } from "@/components";

import { HomeHeader } from "./HomeHeader";
import { useState } from "react";
import { HomeClasses } from "./HomeClasses";

export const Home = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('')
  const { data: classes } = useClasses()

  return (
    <Layout>
      <VStack flex={1} bg='gray.700' pb={16}>
        <HomeHeader />

        <VStack px={8}>
          <Input 
            mt={10} 
            variation='secondary' 
            placeholder='Procure por suas aulas'
          />
          <BuildingFilter 
            activeBuilding={selectedBuilding} 
            selectBuilding={(b: string) => setSelectedBuilding(b)} 
          />
          <HomeClasses />
        </VStack>
      </VStack>
    </Layout>
  );
};