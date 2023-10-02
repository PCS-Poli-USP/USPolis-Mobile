import { Layout, BuildingFilter, Input, VStack } from '@/components'
import { logger } from '@/services/logger'

import React, { useState } from 'react'
import { EventsList } from './EventsList'
import { useDebounce } from '@/hooks'

const EventsListMemo = React.memo(EventsList)

export const Events = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const debouncedBuilding = useDebounce(selectedBuilding, 500)

  const selectBuilding = (b: string) => {
    if (selectedBuilding === b) {
      setSelectedBuilding('')
    } else {
      logger.logEvent('Edifício Selecionado', { building: b, screen: 'Home' })
      setSelectedBuilding(b)
    }
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
          <EventsListMemo
            buildingFilter={debouncedBuilding}
            nameFilter={nameFilter}
          />
        </VStack>
      </VStack>
    </Layout>
  )
}
