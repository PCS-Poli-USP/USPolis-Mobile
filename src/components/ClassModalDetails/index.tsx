import {
  Modal,
  VStack,
  Text,
  Flex,
  Button,
  useTheme,
  Box,
  Progress,
} from "native-base";
import FeatherIcons from "@expo/vector-icons/Feather";
import { useClasses } from "@/hooks/react-query/useClasses";
import { parseISO, format, differenceInDays } from "date-fns";
import { useSchedule } from "@/hooks/useSchedule";
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
  const { colors } = useTheme();
  const { data: classes } = useClasses();
  const { schedule, toggleClassOnSchedule } = useSchedule();

  const sclass = classes?.find((c) => c.id === classId);

  if (!sclass) return <></>;

  const progressValue =
    (differenceInDays(new Date(), parseISO(sclass.end_period)) /
      differenceInDays(
        parseISO(sclass.start_period),
        parseISO(sclass.end_period)
      )) *
    100;

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
      <Modal.Content mt="auto" mb={0} borderRadius="3xl">
        <Modal.Header bgColor="gray.700" borderBottomColor="transparent">
          <VStack alignItems="center" space="3">
            <Text color="white" fontSize="lg">
              {sclass.subject_code}
            </Text>
            <Text color="white" fontSize="lg">
              {sclass.subject_name}
            </Text>
            <Text color="gray.200" fontSize="lg">
              Turma {sclass.class_code.slice(-2)}
            </Text>
          </VStack>
        </Modal.Header>
        <Modal.Body bgColor="gray.700" px={8}>
          <VStack space="5">
            {sclass.schedule.map((event) => (
              <Box key={event.id}>
                <Text color="white" mb={1}>
                  {event.week_day}, das {event.start_time} às {event.end_time}
                </Text>
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
                  <Button
                    variant="link"
                    _text={{ color: "green.500" }}
                    endIcon={
                      <FeatherIcons
                        name="chevron-right"
                        color={colors.green[500]}
                        size={15}
                      />
                    }
                  >
                    Ver no mapa
                  </Button>
                </Flex>
              </Box>
            ))}
            <Box>
              <Text color="gray.200">Docente:</Text>
              <Text color="white">Clodoaldo Grotta Ragazzo</Text>
            </Box>
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
              variant="outline"
              borderColor="green.500"
              _text={{ color: "green.500" }}
              onPress={() => toggleClassOnSchedule(classId)}
            >
              {schedule.includes(classId)
                ? "Remover de minhas disciplinas"
                : "Adicionar em minhas disciplinas"}
            </Button>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
