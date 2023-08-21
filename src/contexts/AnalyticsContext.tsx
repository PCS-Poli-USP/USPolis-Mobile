import { AbTesting } from '@/dtos'
import { DEFAULT_AB_TESTING, generateAbTesting } from '@/dtos/ab-testing'
import { logger } from '@/services/logger'
import { abTestingStorage } from '@/storage/ab-testing'
import { useContext, useEffect, createContext, useState } from 'react'

export type AnalyticsContextDataProps = {
  tests: AbTesting
  isLoading: boolean
}

type AnalyticsContextProviderProps = {
  children: React.ReactNode
}

export const AnalyticsContext = createContext({} as AnalyticsContextDataProps)

export const AnalyticsContextProvider = ({
  children,
}: AnalyticsContextProviderProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [tests, setTests] = useState<AbTesting>({} as AbTesting)

  useEffect(() => {
    const getAbTestings = async () => {
      const tests = await abTestingStorage.get()

      let finalNewTests = tests

      if (!tests) {
        const newTests = generateAbTesting()
        await abTestingStorage.save(newTests)
        finalNewTests = newTests
      } else {
        const testHasMissing = Object.keys(DEFAULT_AB_TESTING).some(
          (key) => tests?.[key] === undefined,
        )

        if (testHasMissing) {
          const fullNewTests = generateAbTesting()

          Object.keys(tests).forEach((key) => {
            if (tests[key]) {
              fullNewTests[key as unknown as keyof AbTesting] =
                tests?.[key as unknown as keyof AbTesting]
            }
          })

          await abTestingStorage.save(fullNewTests)
          finalNewTests = fullNewTests
        }
      }

      setTests(finalNewTests)

      Object.keys(finalNewTests).forEach((key) => {
        if (finalNewTests[key as unknown as keyof AbTesting]) {
          logger.setUserProperty(
            key,
            finalNewTests[key as unknown as keyof AbTesting],
          )
        }
      })

      logger.logEvent('App inicializado')
    }

    getAbTestings()
  }, [])

  return (
    <AnalyticsContext.Provider value={{ isLoading, tests }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)

  return context
}
