import { Layout, BuildingFilter, Input, VStack, Button, Typography } from "@/components";
import { logger } from "@/services/logger";

import { useState } from "react";
import { HomeClasses } from "./HomeClasses";
import { useDebounce } from "@/hooks";
import React from "react";
import { ClassFullSearchDrawer } from "./FullSearchDrawer";

const HomeClassesMemo = React.memo(HomeClasses)

export const Home = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [nameFilter, setNameFilter] = useState("");

  const debouncedBuilding = useDebounce(selectedBuilding, 500)

  const selectBuilding = (b: string) => {
    if (selectedBuilding === b) {
      setSelectedBuilding("")
    } else {
      logger.logEvent('Edifício Selecionado', { building: b, screen: 'Home' })
      setSelectedBuilding(b)
    }
  }

  const handleSmartSearch = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  return (
    <Layout>
      <VStack flex={1} backgroundColor="graySeven" paddingBottom={"m"}>
        <VStack paddingHorizontal="l">
          <VStack marginTop={"l"} width={'100%'}>
            <Button
              variant={"primary"}
              title="Buscar disciplinas por curso e período"
              onPress={handleSmartSearch}
            />
            <Typography color="white" textAlign="center" my="m">ou</Typography>
            <Input
              variation="secondary"
              placeholder="Procure por suas aulas"
              onChangeText={(text) => setNameFilter(text)}
              onBlur={() => logger.logEvent('Busca Realizada', { search: nameFilter, screen: 'Home' })}
            />
          </VStack>
          <BuildingFilter
            activeBuilding={selectedBuilding}
            selectBuilding={selectBuilding}
          />
          <HomeClassesMemo
            buildingFilter={debouncedBuilding}
            nameFilter={nameFilter}
          />
        </VStack>
      </VStack>

      <ClassFullSearchDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </Layout>
  );
};
