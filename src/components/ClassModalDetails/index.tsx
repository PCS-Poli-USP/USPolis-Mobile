import { useClasses } from "@/hooks/react-query/useClasses";
import { useSchedule } from "@/hooks/useSchedule";
import { AppRoutesType } from "@/routes/app.routes";
import FeatherIcons from "@expo/vector-icons/Feather";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { differenceInDays, format, parseISO } from "date-fns";
import {
  Box,
  Flex,
  HStack,
  Heading,
  Modal,
  Progress,
  Text,
  VStack,
  useTheme,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { Button } from "../Button";
import { sortEventsByScheduleTime } from "./utils";
import { Building } from "../../dtos/classes";
interface ClassModalDetailsProps {
  classId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ClassModalDetails = ({
  classId,
  isOpen,
  onClose,
}: ClassModalDetailsProps) => {
  const navigation = useNavigation<NavigationProp<AppRoutesType>>();
  const { colors } = useTheme();
  const { data: classes } = useClasses();
  const { schedule, toggleClassOnSchedule } = useSchedule();

  const sclass = classes?.find((c) => c.id === classId);

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      animationPreset="slide"
      size="full"
      _backdrop={{
        bgColor: "gray.100",
      }}
    >
      <Modal.Content mt="auto" mb={0} borderRadius="3xl" bgColor="gray.700">
        <Modal.Header bgColor="gray.700" borderBottomColor="transparent">
          <VStack alignItems="center" space="3">
            <Heading fontFamily={"heading"} color="white" fontSize="lg">
              {sclass.subject_code}
            </Heading>
            <Heading fontFamily={"heading"} color="white" fontSize="lg">
              {sclass.subject_name}
            </Heading>
            <Text color="gray.200" fontSize="lg">
              Turma {sclass.class_code.slice(-2)}
            </Text>
          </VStack>
        </Modal.Header>
        <Modal.Body bgColor="gray.700" px={8} pb={8}>
          <VStack space="5" bgColor="gray.700">
            {sclass.schedule
              .sort(sortEventsByScheduleTime)
              .map((event, index) => (
                <Box key={`${event.id}-${index}`}>
                  <Text fontFamily={"heading"} color="white" mb={1}>
                    {event.week_day}, das {event.start_time} às {event.end_time}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigateToMap(event.building, event.floor)}
                  >
                    <Flex
                      direction="row"
                      justify="space-between"
                      align="center"
                      bgColor="gray.500"
                      borderRadius="md"
                      p={3}
                    >
                      <VStack space="1">
                        <Text color="white">Prédio: {event.building}</Text>
                        <Text color="white">Sala: {event.classroom}</Text>
                      </VStack>
                      <HStack alignItems={"center"}>
                        <Text color={"green.500"} mr="1">
                          Ver no mapa
                        </Text>
                        <FeatherIcons
                          name="chevron-right"
                          color={colors.green[500]}
                          size={15}
                        />
                      </HStack>
                    </Flex>
                  </TouchableOpacity>
                </Box>
              ))}
            {!!sclass.professor && (
              <Box>
                <Text color="gray.200">Docente:</Text>
                <Text color="white">{sclass.professor}</Text>
              </Box>
            )}
            <Box>
              <Flex direction="row" justify="space-between">
                <Box>
                  <Text color="gray.200">Início</Text>
                  <Text color="white">
                    {format(parseISO(sclass.start_period), "dd/MM/yyyy")}
                  </Text>
                </Box>
                <Box>
                  <Text color="gray.200">Fim</Text>
                  <Text color="white">
                    {format(parseISO(sclass.end_period), "dd/MM/yyyy")}
                  </Text>
                </Box>
              </Flex>
              <Progress
                value={progressValue}
                size="md"
                mt={1}
                _filledTrack={{
                  bg: "green.700",
                }}
              />
            </Box>
            <Button
              variant={"outlined"}
              title={
                schedule.includes(classId)
                  ? "Remover de minhas disciplinas"
                  : "Adicionar em minhas disciplinas"
              }
              onPress={() => toggleClassOnSchedule(classId)}
            />
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
