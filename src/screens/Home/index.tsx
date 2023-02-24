import { Center, Heading, VStack } from "native-base";
import { useClasses } from "@/hooks/react-query/useClasses";

import { Layout, BuildingFilter, Input } from "@/components";

import { HomeHeader } from "./HomeHeader";
import { useState } from "react";
import { HomeClasses } from "./HomeClasses";

export const Home = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  return (
    <Layout>
      <VStack flex={1} bg="gray.700" pb={16}>
        {/* <HomeHeader /> */}

        <VStack px={8}>
          <Input
            mt={10}
            variation="secondary"
            placeholder="Procure por suas aulas"
            onChangeText={(text) => setNameFilter(text)}
          />
          <BuildingFilter
            activeBuilding={selectedBuilding}
            selectBuilding={(b: string) => selectedBuilding === b ? setSelectedBuilding('') : setSelectedBuilding(b)}
          />
          <HomeClasses buildingFilter={selectedBuilding} nameFilter={nameFilter} />
        </VStack>
      </VStack>
    </Layout>
  );
};
