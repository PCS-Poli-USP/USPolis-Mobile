import { Box, Button, Checkbox, Dropdown, Typography, VStack } from "@/components"
import { useMemo, useState } from "react";
import { useFullSearch } from "./context";
import { IPickerOption } from "@/components/Dropdown";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";

export const ClassSelection = () => {
  const { handleUpdateInfos, course, semester } = useFullSearch()

  const [availableDisciplines, setAvailableDisciplines] = useState<ISelectableDiscipline[]>([
    {
      id: '1',
      name: 'PRO3373 - Introdução à Economia',
      selected: false,
      classes: [
        {
          label: 'Turma 1 - Segunda 17:30',
          value: 'Turma 1 - Segunda 17:30'
        },
        {
          label: 'Turma 2 - Sexta 12:30',
          value: 'Turma 2 - Sexta 12:30'
        },
        {
          label: 'Turma 3 - Quarta 15:30',
          value: 'Turma 3 - Quarta 15:30'
        },
      ],
      selectedClass: ''
    },
    {
      id: '2',
      name: 'MAP3121 - Métodos Numéricos e Aplicações',
      selected: false,
      classes: [
        {
          label: 'Turma 1 - Segunda 17:30',
          value: 'Turma 1 - Segunda 17:30'
        },
        {
          label: 'Turma 2 - Sexta 12:30',
          value: 'Turma 2 - Sexta 12:30'
        },
        {
          label: 'Turma 3 - Quarta 15:30',
          value: 'Turma 3 - Quarta 15:30'
        },
      ],
      selectedClass: ''
    },
    {
      id: '3',
      name: 'MAT2453 - Cálculo Diferencial e Integral III',
      selected: false,
      classes: [
        {
          label: 'Turma 1 - Segunda 17:30',
          value: 'Turma 1 - Segunda 17:30'
        },
        {
          label: 'Turma 2 - Sexta 12:30',
          value: 'Turma 2 - Sexta 12:30'
        },
        {
          label: 'Turma 3 - Quarta 15:30',
          value: 'Turma 3 - Quarta 15:30'
        },
      ],
      selectedClass: ''
    },
    {
      id: '4',
      name: 'PEA3100 - Introdução à Engenharia de Produção',
      selected: false,
      classes: [
        {
          label: 'Turma 1 - Segunda 17:30',
          value: 'Turma 1 - Segunda 17:30'
        },
        {
          label: 'Turma 2 - Sexta 12:30',
          value: 'Turma 2 - Sexta 12:30'
        },
        {
          label: 'Turma 3 - Quarta 15:30',
          value: 'Turma 3 - Quarta 15:30'
        },
      ],
      selectedClass: ''
    },
    {
      id: '5',
      name: 'FEP0111 - Física Aplicada à Engenharia I',
      selected: false,
      classes: [
        {
          label: 'Turma 1 - Segunda 17:30',
          value: 'Turma 1 - Segunda 17:30'
        },
        {
          label: 'Turma 2 - Sexta 12:30',
          value: 'Turma 2 - Sexta 12:30'
        },
        {
          label: 'Turma 3 - Quarta 15:30',
          value: 'Turma 3 - Quarta 15:30'
        },
      ],
      selectedClass: ''
    }
  ] )

  const handleSelectDiscipline = (id: string) => {
    const newDisciplines = availableDisciplines.map((discipline) => {
      if (discipline.id === id) {
        return {
          ...discipline,
          selected: !discipline.selected
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

  return (
    <>
      <Box backgroundColor="graySeven" borderBottomColor="transparent">
        <VStack alignItems="center" marginBottom={'l'}>
          <Typography variant={"heading"} color="white" fontSize={20} marginBottom={'s'} textAlign="center">
            Encontramos as disciplinas a seguir
          </Typography>
          <Typography textAlign="center" color="grayTwo" fontSize={14} marginBottom={'s'} paddingHorizontal="m">
            Você pode optar por adicioná-las ou não às suas disciplinas
          </Typography>
          <Box mb={'l'} />

          <Box paddingHorizontal="m">
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
          </Box>
        </VStack>
      </Box>
      <Box backgroundColor="graySeven" paddingHorizontal={'m'} paddingBottom={'s'}>
        <VStack backgroundColor="graySeven" marginBottom="m">
          <Button
            variant={"outlined"}
            title={"Adicionar em minhas disciplinas"}
            onPress={() => null}
          />
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