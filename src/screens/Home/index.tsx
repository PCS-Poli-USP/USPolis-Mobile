import { Layout, BuildingFilter, Input, VStack } from '@/components'
import { logger } from '@/services/logger'

import React, { useState } from 'react'
import { HomeClasses } from './HomeClasses'
import { useDebounce } from '@/hooks'
import { ClassFullSearchDrawer } from './FullSearchDrawer'
import {
  FullSearchContextProvider,
  useFullSearch,
} from './FullSearchDrawer/context'

const HomeClassesMemo = React.memo(HomeClasses)

export const HomeContent = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const { isDrawerOpen, handleUpdateInfos } = useFullSearch()

  const debouncedBuilding = useDebounce(selectedBuilding, 500)

  const selectBuilding = (b: string) => {
    if (selectedBuilding === b) {
      setSelectedBuilding('')
    } else {
      logger.logEvent('Edifício Selecionado', { building: b, screen: 'Home' })
      setSelectedBuilding(b)
    }
  }

  const handleSmartSearch = () => {
    handleUpdateInfos({
      isDrawerOpen: !isDrawerOpen,
    })
  }

  return (
    <Layout>
      <VStack flex={1} backgroundColor="graySeven" paddingBottom={'m'}>
        <VStack paddingHorizontal="l">
          <VStack marginTop={'l'} width={'100%'}>
            <Input
              variation="secondary"
              placeholder={'Procure por seu curso ou aulas'}
              onChangeText={(text) => setNameFilter(text)}
              onBlur={() =>
                logger.logEvent('Busca Realizada', {
                  search: nameFilter,
                  screen: 'Home',
                })
              }
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

      <ClassFullSearchDrawer
        isOpen={isDrawerOpen}
        onClose={() => handleUpdateInfos({ isDrawerOpen: false })}
      />
    </Layout>
  )
}

export const Home = () => {
  return (
    <FullSearchContextProvider>
      <HomeContent />
    </FullSearchContextProvider>
  )
}
