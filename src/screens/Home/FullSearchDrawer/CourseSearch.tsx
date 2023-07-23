import { Box, Button, Dropdown, Typography, VStack } from "@/components"
import { useMemo } from "react";
import { useFullSearch } from "./context";

export const CourseSearch = () => {
  const { handleUpdateInfos, course, semester } = useFullSearch()

  const courses = useMemo(() => {
    return [
      {
        label: "Curso 1",
        value: "1",
      },
      {
        label: "Curso 2",
        value: "2",
      },
      {
        label: "Curso 3",
        value: "3",
      },
    ];
  }, [])

  const semesters = useMemo(() => {
    return [
      {
        label: "1º Semestre",
        value: "1",
      },
      {
        label: "2º Semestre",
        value: "2",
      },
      {
        label: "3º Semestre",
        value: "3",
      },
      {
        label: "4º Semestre",
        value: "4",
      },
      {
        label: "5º Semestre",
        value: "5",
      },
      {
        label: "6º Semestre",
        value: "6",
      },
      {
        label: "7º Semestre",
        value: "7",
      },
      {
        label: "8º Semestre",
        value: "8",
      },
      {
        label: "9º Semestre",
        value: "9",
      },
      {
        label: "10º Semestre",
        value: "10",
      },
    ];
  }, [])

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
            label={"Selecione seu semestre ideal"}
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