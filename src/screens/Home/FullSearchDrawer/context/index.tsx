import { User } from '@/dtos'
import { userStorage } from '@/storage/user'
import React, { useCallback, useMemo } from 'react'
import { useEffect } from 'react'
import { createContext, useState } from 'react'

export type FullSearchContextDataProps = {
  course: string
  semester: string
  handleUpdateInfos: (data: Partial<FullSearchContextDataProps>) => void
  index: number
}

type FullSearchContextProviderProps = {
  children: React.ReactNode
}

export const FullSearchContext = createContext({} as FullSearchContextDataProps)

export const useFullSearch = () => {
  const context = React.useContext(FullSearchContext)

  if (!context) {
    throw new Error('useFullSearch must be used within an FullSearchContext')
  }

  return context
}

export const FullSearchContextProvider = ({ children }: FullSearchContextProviderProps) => {
  const [course, setCourse] = React.useState("1");
  const [semester, setSemester] = React.useState("1");
  const [index, setIndex] = React.useState(0);

  const handleUpdateInfos = useCallback((data: Partial<FullSearchContextDataProps>) => {
    if (data.course) {
      setCourse(data.course)
    }

    if (data.semester) {
      setSemester(data.semester)
    }

    if (data.index !== undefined) {
      setIndex(data.index)
    }
  }, [])

  return (
    <FullSearchContext.Provider value={{ 
      course, 
      semester, 
      handleUpdateInfos, 
      index 
    }}>
      {children}
    </FullSearchContext.Provider>
  )
}
