import { useSchedule } from "@/hooks/useSchedule";
import { AppRoutesType } from "@/routes/app.routes";
import FeatherIcons from "@expo/vector-icons/Feather";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { differenceInDays, format, parseISO } from "date-fns";
import { Pressable } from "react-native";
import { Button } from "../Button";
import { sortEventsByScheduleTime } from "./utils";
import { Building, IClass } from "../../dtos/classes";
import { Theme } from "@/theme/theme";
import { useTheme } from "@shopify/restyle";
import { Box, HStack, Typography, VStack } from "../ui";
import { logger } from "@/services/logger";
import { Modal } from "../Modal";
import React, { useState } from 'react'
import { useSchedule } from '@/hooks/useSchedule'
import { AppRoutesType } from '@/routes/app.routes'
import FeatherIcons from '@expo/vector-icons/Feather'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { differenceInDays, format, parseISO } from 'date-fns'
import { Pressable } from 'react-native'
import { Button } from '../Button'
import { sortEventsByScheduleTime } from './utils'
import { Building, IClass } from '../../dtos/classes'
import { Theme } from '@/theme/theme'
import { useTheme } from '@shopify/restyle'
import { Box, HStack, Typography, VStack } from '../ui'
import { logger } from '@/services/logger'
import { Modal } from '../Modal'

import { type StackRoutesType } from '@/routes'

interface ClassModalDetailsProps {
  sclass?: IClass | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClassModalDetails = ({
  sclass,
  isOpen,
  onClose,
}: ClassModalDetailsProps) => {
  const navigation = useNavigation<NavigationProp<AppRoutesType>>()
  const navigationStack = useNavigation<NavigationProp<StackRoutesType>>()
  const { colors } = useTheme<Theme>()
  const { schedule, toggleClassOnSchedule } = useSchedule()
  const [ isForumModalOpen, setIsForumModalOpen] = useState(false)

  const handleToggleClassOnSchedule = (classId: number, className: string) => {
    if (schedule.includes(classId)) {
      logger.logEvent("Aula Removida no Cronograma", { class: className });
    } else {
      logger.logEvent("Aula Adicionada do Cronograma", { class: className });
    }

    toggleClassOnSchedule(classId);
    logger.setUserProperty("classes_on_schedule", schedule.length.toString());
  };

  if (!sclass) return <></>;

  const progressValue =
    differenceInDays(new Date(), parseISO(sclass.end_date)) > 0
      ? (differenceInDays(new Date(), parseISO(sclass.end_date)) /
          differenceInDays(
            parseISO(sclass.start_date),
            parseISO(sclass.end_date)
          )) *
        100
      : 0;

  const navigateToMap = (building: Building, floor: number) => {
    navigation.navigate("Maps", {
      building,
      floor,
    });
    onClose();
  };

  const navigateToForum = (sclass: IClass) => {
    navigationStack.navigate('Forum', 
      {sclass}
    )
    onClose();
  }
  const openForumModal = () => {
    logger.logEvent("Clicou p abrir forum");
    navigateToForum(sclass);
    //setIsForumModalOpen(true);
  }


  return (
    <Box flex={1}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        // isVisible={isOpen}
        // backdropColor={colors.grayOne}
        // backdropOpacity={0.2}
        // swipeDirection={'down'}
        // onBackdropPress={onClose}
        // onSwipeComplete={onClose}
        // coverScreen
        // style={{ margin: 0 }}
      >
        <Box
          width={"100%"}
          borderTopLeftRadius={8}
          borderTopRightRadius={8}
          backgroundColor="graySeven"
          position="absolute"
          bottom={0}
          paddingHorizontal={"s"}
          paddingVertical="l"
        >
          <Box backgroundColor="graySeven" borderBottomColor="transparent">
            <VStack alignItems="center" marginBottom={"m"}>
              <Typography
                variant={"heading"}
                color="white"
                
                fontSize={20}
                marginBottom={"s"}
              >
                {sclass.subject_code}
              </Typography>
              <Typography
                variant={"heading"}
                color="white"
                fontSize={18}
                marginBottom={"s"}
              >
                {sclass.subject_name}
              </Typography>
              <Typography color="grayTwo" fontSize={14} marginBottom={"s"}>
                Turma {sclass.class_code.slice(-2)}
              <Typography color="grayTwo" fontSize={14}>
                Turma {sclass.code}
              </Typography>
              <Typography color="grayTwo" fontSize={14}>
                {sclass.professors.join(", ")}
              </Typography>
            </VStack>
          </Box>
          <Box
            backgroundColor="graySeven"
            paddingHorizontal={"m"}
            paddingBottom={"s"}
          >
            <VStack backgroundColor="graySeven" marginBottom="m">
              {sclass.schedules
                .sort(sortEventsByScheduleTime)
                .map((event, index) => (
                  <Box key={`${event.id}-${index}`} marginBottom={"s"}>
                    <Typography variant={"heading"} color="white" mb={"xs"}>
                      {event.week_day}, das {event.start_time} às{" "}
                      {event.end_time}
                    </Typography>
                    <Pressable
                      onPress={() => navigateToMap(event.building, event.floor)}
                    >
                      <Box
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        backgroundColor="grayFive"
                        borderRadius={8}
                        padding={"s"}
                      >
                        <VStack gap={"xs"}>
                          <Typography color="white">
                            Prédio: {event.building}
                          </Typography>
                          <Typography color="white">
                            Sala: {event.classroom}
                          </Typography>
                        </VStack>
                        <HStack alignItems={"center"}>
                          <Typography color={"primary"} marginRight="s">
                            Ver no mapa
                          </Typography>
                          <FeatherIcons
                            name="chevron-right"
                            color={colors.primary}
                            size={15}
                          />
                        </HStack>
                      </Box>
                    </Pressable>
                  </Box>
                ))}
              {!!sclass.professors && (
                <Box marginBottom="m">
                  <Typography color="grayTwo">Docente:</Typography>
                  <Typography color="white">{sclass.professors}</Typography>
                </Box>
              )}
              <Box marginBottom="m">
                <Box flexDirection="row" justifyContent="space-between">
                  <Box>
                    <Typography color="grayTwo">Início</Typography>
                    <Typography color="white">
                      {format(parseISO(sclass.start_period), "dd/MM/yyyy")}
                      {format(parseISO(sclass.start_date), 'dd/MM/yyyy')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="grayTwo">Fim</Typography>
                    <Typography color="white">
                      {format(parseISO(sclass.end_period), "dd/MM/yyyy")}
                      {format(parseISO(sclass.end_date), 'dd/MM/yyyy')}
                    </Typography>
                  </Box>
                </Box>
                {/* <Progress
                  value={progressValue}
                  size='md'
                  mt={1}
                  _filledTrack={{
                    bg: 'green.700',
                  }}
                /> */}
              </Box>
              <Button 
                variant={"outlined"}
                title={
                  "Abrir Fórum da Disciplina"
                }
                onPress={() =>
                  {onClose();
                  openForumModal();}
                }
              />
              <Button
                variant={"outlined"}
                title={
                  schedule.includes(sclass.id)
                    ? "Remover de minhas disciplinas"
                    : "Adicionar em minhas disciplinas"
                }
                onPress={() =>
                  handleToggleClassOnSchedule(sclass.id, sclass.subject_name)
                }
              />
            </VStack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
