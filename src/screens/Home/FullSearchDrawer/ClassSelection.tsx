import { Box, Button, Checkbox, Dropdown, Typography, VStack } from "@/components"
import { useEffect, useMemo, useState } from "react";
import { useFullSearch } from "./context";
import { IPickerOption } from "@/components/Dropdown";
import { ActivityIndicator, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { useCourseProgram } from "@/hooks/react-query/useCourseProgram";
import { logger } from "@/services/logger";
import { useSchedule } from "@/hooks/useSchedule";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppRoutesType } from "@/routes/app.routes";

export const ClassSelection = ({ onClose }: { onClose: () => void }) => {
  const { handleUpdateInfos, course, semester } = useFullSearch()
  const { toggleClassOnSchedule } = useSchedule();
  const navigation = useNavigation<NavigationProp<AppRoutesType>>();

  const { data: courseProgram, isLoading: isLoadingCourses } = useCourseProgram({
    program: course,
    period: semester
  })

  const [availableDisciplines, setAvailableDisciplines] = useState<ISelectableDiscipline[]>([])
  
  useEffect(() => {
    if (courseProgram) {
      const newAvailableDisciplines = courseProgram.map((course) => ({
        id: course.code,
        name: `${course.code} - ${course.name}`,
        selected: false,
        classes: course.classes.map(iclass => ({
          label: `Turma ${iclass.class_code}`,
          value: iclass.id
        })),
        selectedClass: ''
      }))

      const availableDisciplinesWithClasses = newAvailableDisciplines.filter(c => c.classes.length)

      setAvailableDisciplines(availableDisciplinesWithClasses)
    }
  }, [courseProgram])


  const handleSelectDiscipline = (id: string) => {
    const newDisciplines = availableDisciplines.map((discipline) => {
      if (discipline.id === id) {
        return {
          ...discipline,
          selected: !discipline.selected,
          selectedClass: discipline.classes?.[0]?.value || ""
        }
      }

      return discipline
    })

    setAvailableDisciplines(newDisciplines)
  }

  const handleSelectClass = (id: string, classId: string) => {
    const newDisciplines = availableDisciplines.map((discipline) => {
      if (discipline.id === id) {
        return {
          ...discipline,
          selectedClass: classId
        }
      }

      return discipline
    })

    setAvailableDisciplines(newDisciplines)
  }

  const handleToggleClassOnSchedule = () => {
    const selectedDisciplines = availableDisciplines.filter(discipline => discipline.selected)
    const selectedClasses = selectedDisciplines.map(discipline => discipline.selectedClass)

    logger.logEvent('Aulas adicionadas automaticamente', { classes: selectedClasses.join(',') })

    selectedClasses.forEach((classId) => {
      toggleClassOnSchedule(classId)
    })

    navigation.navigate('MyClasses')
    handleUpdateInfos({
      index: 0,
    })
    onClose()
  }

  return (
    <>
      <Box backgroundColor="graySeven" borderBottomColor="transparent">
        <VStack alignItems="center" marginBottom={'l'}>
          {!availableDisciplines.length && !isLoadingCourses && (
            <>
            <Typography variant={"heading"} color="white" fontSize={20} marginBottom={'s'} textAlign="center">
              Não encontramos disciplinas
            </Typography>
            <Typography textAlign="center" color="grayTwo" fontSize={14} marginBottom={'s'} paddingHorizontal="m">
              Não encontramos disciplinas para o curso e período selecionados
            </Typography>
          </>
          )}

          {availableDisciplines.length > 0 && (
            <>
              <Typography variant={"heading"} color="white" fontSize={20} marginBottom={'s'} textAlign="center">
                Encontramos as disciplinas a seguir
              </Typography>
              <Typography textAlign="center" color="grayTwo" fontSize={14} marginBottom={'s'} paddingHorizontal="m">
                Você pode optar por adicioná-las ou não às suas disciplinas
              </Typography>
            </>
          )}
          <Box mb={'l'} />

          <Box paddingHorizontal="m" maxHeight={(3 * Dimensions.get('window').height) / 7}>
            {isLoadingCourses && (
              <ActivityIndicator />
            )}
            {!isLoadingCourses && !!availableDisciplines.length && (
              <FlatList 
                data={availableDisciplines}
                nestedScrollEnabled
                keyExtractor={(item) => item.id}
                style={{
                  maxHeight: (3 * Dimensions.get('window').height) / 7
                }}
                renderItem={({ item }) => (
                  <MaybeTouchableSelectableDiscipline
                    {...item}
                    handleSelect={() => handleSelectDiscipline(item.id)}
                    handleSelectClass={(classId) => handleSelectClass(item.id, classId)}
                  />
                )}
              />
              )}
          </Box>
        </VStack>
      </Box>
      <Box backgroundColor="graySeven" paddingHorizontal={'m'} paddingBottom={'s'}>
        <VStack backgroundColor="graySeven" marginBottom="m">
        {!isLoadingCourses && !!availableDisciplines.length && (
          <Button
            variant={"outlined"}
            title={"Adicionar em minhas disciplinas"}
            onPress={handleToggleClassOnSchedule}
            disabled={!availableDisciplines.some(discipline => discipline.selected)}
          />
          )}
          <Box mb="s" />
          <Button
            variant={"raw"}
            title={"Voltar para a busca"}
            onPress={() => {
              handleUpdateInfos({
                index: 0,
              })
            }}
          />
        </VStack>
      </Box>
    </>
  )
}

interface ISelectableDiscipline {
  id: string
  name: string;
  selected: boolean;
  classes: IPickerOption[];
  selectedClass: string
}

interface ISelectableDisciplineProps extends ISelectableDiscipline {
  handleSelect(): void
  handleSelectClass(classId: string): void
}

const MaybeTouchableSelectableDiscipline = (props: ISelectableDisciplineProps) => {
  if (!props.selected) {
    return (
      <TouchableOpacity onPress={props.handleSelect}>
        <SelectableDiscipline {...props} />
      </TouchableOpacity>
    )
  }

  return (
    <SelectableDiscipline {...props} />
  )
}

const SelectableDiscipline = ({ name, selected, classes, handleSelect, handleSelectClass, selectedClass }: ISelectableDisciplineProps) => {
  return (
    <Box 
      flex={1}
      backgroundColor={'grayFive'} 
      padding={'m'} 
      marginBottom="m" 
      borderRadius={8} 
      flexDirection="row" 
      alignItems="center"
      justifyContent="space-between"
      opacity={!selected ? 0.5 : 1}
    >
      <Box width={'80%'}>
        <Typography color="white" variant="heading" fontSize={16} marginBottom={'s'} numberOfLines={1}>
          {name}
        </Typography>

        {selected && (
          <Dropdown
            label="Turma:"
            disabled={!selected}
            data={classes}
            selected={selectedClass}
            onSelect={(v) => handleSelectClass(v)}
          />
        )}
      </Box>
      <Box width={'20%'} marginLeft="auto" alignItems="flex-end" marginRight="s">
        <Checkbox 
          selected={selected} 
          onPress={() => handleSelect()} 
        />
      </Box>
    </Box>
  )
}