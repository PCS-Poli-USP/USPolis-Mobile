import { Layout, BuildingFilter, Input, VStack } from "@/components";
import { logger } from "@/services/logger";

import { useState } from "react";
import { HomeClasses } from "./HomeClasses";

export const Home = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const selectBuilding = (b: string) => {
    if (selectedBuilding === b) {
      setSelectedBuilding("")
    } else {
      logger.logEvent('Edifício Selecionado', { building: b, screen: 'Home' })
      setSelectedBuilding(b)
    }
  }

  return (
    <Layout>
      <VStack flex={1} backgroundColor="graySeven" paddingBottom={"m"}>
        <VStack paddingHorizontal="l">
          <Input
            marginTop={"l"}
            variation="secondary"
            placeholder="Procure por suas aulas"
            onChangeText={(text) => setNameFilter(text)}
            onBlur={() => logger.logEvent('Busca Realizada', { search: nameFilter, screen: 'Home' })}
          />
          <BuildingFilter
            activeBuilding={selectedBuilding}
            selectBuilding={selectBuilding}
          />
          <HomeClasses
            buildingFilter={selectedBuilding}
            nameFilter={nameFilter}
          />
        </VStack>
      </VStack>
    </Layout>
  );
};
