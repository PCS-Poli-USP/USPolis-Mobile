import { Layout, BuildingFilter, Input, VStack } from "@/components";

import { useState } from "react";
import { HomeClasses } from "./HomeClasses";

export const Home = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  return (
    <VStack flex={1} backgroundColor="graySeven" paddingBottom={"m"}>
      <VStack paddingHorizontal="m">
        <Input
          marginTop={"s"}
          variation="secondary"
          placeholder="Procure por suas aulas"
          onChangeText={(text) => setNameFilter(text)}
        />
        <BuildingFilter
          activeBuilding={selectedBuilding}
          selectBuilding={(b: string) =>
            selectedBuilding === b
              ? setSelectedBuilding("")
              : setSelectedBuilding(b)
          }
        />
        <HomeClasses
          buildingFilter={selectedBuilding}
          nameFilter={nameFilter}
        />
      </VStack>
    </VStack>
  );
};
