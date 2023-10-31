import { Layout, Input, VStack, MailComposer, Box } from '@/components'
import { logger } from '@/services/logger'

import React, { useState } from 'react'
import { EventsList } from './EventsList'

const EventsListMemo = React.memo(EventsList)

export const Events = () => {
  const [nameFilter, setNameFilter] = useState('')

  return (
    <Layout>
      <VStack flex={1} backgroundColor="graySeven" paddingBottom={'m'}>
        <VStack paddingHorizontal="l">
          <VStack marginTop={'l'} width={'100%'}>
            <Input
              variation="secondary"
              placeholder={'Procure por eventos'}
              onChangeText={(text) => setNameFilter(text)}
              onBlur={() =>
                logger.logEvent('Busca Realizada', {
                  search: nameFilter,
                  screen: 'Home',
                })
              }
            />
          </VStack>
          <MailComposer />
          <Box marginBottom="m" />
          <EventsListMemo buildingFilter={''} nameFilter={nameFilter} />
        </VStack>
      </VStack>
    </Layout>
  )
}
