import { useSchedule } from "@/hooks/useSchedule";
import { AppRoutesType } from "@/routes/app.routes";
import FeatherIcons from "@expo/vector-icons/Feather";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { differenceInDays, format, parseISO } from "date-fns";
import { TouchableOpacity } from "react-native";
import { Button } from "../Button";
import { sortEventsByScheduleTime } from "./utils";
import { Building, IClass } from "../../dtos/classes";
import { Theme } from "@/theme/theme";
import { useTheme } from "@shopify/restyle";
import Modal from 'react-native-modal';
import { Box, HStack, Typography, VStack } from "../ui";

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
  const navigation = useNavigation<NavigationProp<AppRoutesType>>();
  const { colors } = useTheme<Theme>();
  const { schedule, toggleClassOnSchedule } = useSchedule();

  if (!sclass) return <></>;

  const progressValue =
    differenceInDays(new Date(), parseISO(sclass.end_period)) > 0
      ? (differenceInDays(new Date(), parseISO(sclass.end_period)) /
          differenceInDays(
            parseISO(sclass.start_period),
            parseISO(sclass.end_period)
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

  return (
    <Box flex={1}>
      <Modal
        isVisible={isOpen}
        backdropColor={colors.grayOne}
        backdropOpacity={0.2}
        swipeDirection={'down'}
        onBackdropPress={onClose}
        onSwipeComplete={onClose}
        coverScreen
        style={{ margin: 0 }}
      >
        <Box width={'100%'} borderTopLeftRadius={8} borderTopRightRadius={8} backgroundColor="graySeven" position="absolute" bottom={0} paddingHorizontal={'s'} paddingVertical="l">
          <Box backgroundColor="graySeven" borderBottomColor="transparent">
            <VStack alignItems="center" marginBottom={'m'}>
              <Typography variant={"heading"} color="white" fontSize={20} marginBottom={'s'}>
                {sclass.subject_code}
              </Typography>
              <Typography variant={"heading"} color="white" fontSize={18} marginBottom={'s'}>
                {sclass.subject_name}
              </Typography>
              <Typography color="grayTwo" fontSize={14}>
                Turma {sclass.class_code.slice(-2)}
              </Typography>
            </VStack>
          </Box>
          <Box backgroundColor="graySeven" paddingHorizontal={'m'} paddingBottom={'s'}>
            <VStack backgroundColor="graySeven" marginBottom="m">
              {sclass.schedule
                .sort(sortEventsByScheduleTime)
                .map((event, index) => (
                  <Box key={`${event.id}-${index}`} marginBottom={'s'}>
                    <Typography variant={"heading"} color="white" mb={'xs'}>
                      {event.week_day}, das {event.start_time} às {event.end_time}
                    </Typography>
                    <TouchableOpacity
                      onPress={() => navigateToMap(event.building, event.floor)}
                    >
                      <Box
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        backgroundColor="grayFive"
                        borderRadius={8}
                        padding={'s'}
                      >
                        <VStack gap={"xs"}>
                          <Typography color="white">Prédio: {event.building}</Typography>
                          <Typography color="white">Sala: {event.classroom}</Typography>
                        </VStack>
                        <HStack alignItems={"center"}>
                          <Typography color={"primary"} marginRight='s'>
                            Ver no mapa
                          </Typography>
                          <FeatherIcons
                            name="chevron-right"
                            color={colors.primary}
                            size={15}
                          />
                        </HStack>
                      </Box>
                    </TouchableOpacity>
                  </Box>
                ))}
              {!!sclass.professor && (
                <Box marginBottom="m">
                  <Typography color="grayTwo">Docente:</Typography>
                  <Typography color="white">{sclass.professor}</Typography>
                </Box>
              )}
              <Box marginBottom="m">
                <Box flexDirection="row" justifyContent="space-between">
                  <Box>
                    <Typography color="grayTwo">Início</Typography>
                    <Typography color="white">
                      {format(parseISO(sclass.start_period), "dd/MM/yyyy")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="grayTwo">Fim</Typography>
                    <Typography color="white">
                      {format(parseISO(sclass.end_period), "dd/MM/yyyy")}
                    </Typography>
                  </Box>
                </Box>
                {/* <Progress
                  value={progressValue}
                  size="md"
                  mt={1}
                  _filledTrack={{
                    bg: "green.700",
                  }}
                /> */}
              </Box>
              <Button
                variant={"outlined"}
                title={
                  schedule.includes(sclass.id)
                    ? "Remover de minhas disciplinas"
                    : "Adicionar em minhas disciplinas"
                }
                onPress={() => toggleClassOnSchedule(sclass.id)}
              />
            </VStack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
