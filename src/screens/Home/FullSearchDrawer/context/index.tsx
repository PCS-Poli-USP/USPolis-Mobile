import { User } from '@/dtos'
import { useCourses } from '@/hooks/react-query/useCourses'
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
  const { data: rawCourses } = useCourses() 
  
  const [course, setCourse] = React.useState(rawCourses?.[0]?.id || "");
  const [semester, setSemester] = React.useState(String(rawCourses?.[0]?.periods?.[0] || ""));
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    if (rawCourses?.[0]) {
      setCourse(rawCourses?.[0]?.id || "")
      setSemester(String(rawCourses?.[0]?.periods?.[0] || ""))
    }
  }, [rawCourses])

  useEffect(() => {
    if (rawCourses) {
      const selectedCourse = rawCourses?.find((rawCourse) => rawCourse.id === course)

      if (selectedCourse) {
        setSemester(String(selectedCourse?.periods?.[0] || ""))
      }
    }
  }, [course])

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
