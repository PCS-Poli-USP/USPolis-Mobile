import { Box, Button, Dropdown, Typography, VStack } from "@/components"
import { useMemo } from "react";
import { useFullSearch } from "./context";
import { useCourses } from "@/hooks/react-query/useCourses";

export const CourseSearch = () => {
  const { handleUpdateInfos, course, semester } = useFullSearch()

  const { data: rawCourses } = useCourses() 

  const courses = useMemo(() => {
    return rawCourses?.map((course) => ({
      label: course.program,
      value: course.id,
    })) || []
  }, [rawCourses])

  const semesters = useMemo(() => {
    const selectedCourse = rawCourses?.find((rawCourse) => rawCourse.id === course)

    if (!selectedCourse) {
      return []
    }

    const { periods } = selectedCourse

    return periods.map((semester) => ({
      label: `${semester}º período`,
      value: String(semester),
    }))
  }, [rawCourses, course])

  const handleSearch = () => {
    handleUpdateInfos({
      index: 1
    })
  }
  
  return (
    <>
      <Box backgroundColor="graySeven" borderBottomColor="transparent">
        <VStack alignItems="center" marginBottom={'l'}>
          <Typography variant={"heading"} color="white" fontSize={20} marginBottom={'s'}>
            Por qual período você deseja buscar?
          </Typography>
          <Box mb={'l'} />
          <Dropdown 
            label={"Selecione seu curso"}
            data={courses}
            onSelect={(v) => handleUpdateInfos({
              course: v
            })} 
            selected={course}
          />
          <Box mb={'m'} />
          <Dropdown 
            label={"Selecione seu período ideal"}
            data={semesters}
            onSelect={(v) => handleUpdateInfos({
              semester: v
            })} 
            selected={semester}              
          />
        </VStack>
      </Box>
      <Box backgroundColor="graySeven" paddingHorizontal={'m'} paddingBottom={'s'}>
        <VStack backgroundColor="graySeven" marginBottom="m">
          <Button
            variant={"outlined"}
            title={"Buscar Disciplinas"}
            disabled={!course || !semester}
            onPress={() => handleSearch()}
          />
        </VStack>
      </Box>
    </>
  )
}