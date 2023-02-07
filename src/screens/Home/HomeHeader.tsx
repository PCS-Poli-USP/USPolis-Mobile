import {
  Center,
  Circle,
  HStack,
  useTheme,
  VStack,
  Text,
  Heading,
} from "native-base";
import FeatherIcons from "@expo/vector-icons/Feather";
import { Layout } from "@/components/Layout";
import { Platform } from "react-native";
import { useAuth } from "@/hooks";

export const HomeHeader = () => {
  const { colors } = useTheme();
  const { handleLogout, user } = useAuth();

  return (
    <HStack
      h={148}
      bg={"gray.600"}
      alignItems="center"
      pt={Platform.OS === "ios" ? 8 : 0}
      px={8}
    >
      <HStack flex={1} alignItems="center">
        <Circle
          borderWidth={2}
          borderColor={"gray.400"}
          h={16}
          w={16}
          bg={"gray.500"}
          mr={3}
        >
          <FeatherIcons name="user" color={colors.gray[200]} size={24} />
        </Circle>
        <VStack>
          <Text color="gray.100" fontSize="md">
            Olá!
          </Text>
          {/* <Heading color="gray.100" fontSize="md" fontFamily={"heading"}>
            {user?.name || ""}
          </Heading> */}
        </VStack>
      </HStack>
      {/* <FeatherIcons
        onPress={handleLogout}
        name="log-out"
        color={colors.gray[200]}
        size={28}
      /> */}
    </HStack>
  );
};
