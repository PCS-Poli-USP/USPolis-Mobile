import { HStack, VStack, Typography } from "@/components";
import FeatherIcons from "@expo/vector-icons/Feather";
import { logger } from "@/services/logger";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { Pressable } from "react-native";
import { StackRoutesType } from "@/routes";
import { Theme } from "@/theme/theme";
import { IClass } from "@/dtos";

function GeneralForumCard() {
    const { colors } = useTheme<Theme>();
    const navigationStack = useNavigation<NavigationProp<StackRoutesType>>();

    const navigateToGeneralForum = () => {
        const gclass: IClass = {
            id: -1,
            code: "",
            professors: [],
            subject_code: "Geral",
            subject_name: "",
            start_date: "",
            end_date: "",
            schedules: [],
            subject_id: -1,
        };
        navigationStack.navigate("Forum", {sclass: gclass});
        logger.logEvent("Fórum geral selecionado");
    };

    return (
        <>
            <Pressable onPress={navigateToGeneralForum}>
                <HStack
                    borderWidth={2}
                    borderColor="secondary"
                    alignItems="center"
                    backgroundColor={"grayFive"}
                    borderRadius={8}
                    padding="m"
                    marginBottom="s"
                >
                    <VStack flex={1} marginRight={"xs"}>
                        <Typography
                            marginBottom={"xs"}
                            fontSize={18}
                            color="white"
                            variant="heading"
                            fontWeight="bold">
                            Fórum Geral
                        </Typography>
                    </VStack>
                    <FeatherIcons
                        name="chevron-right"
                        color={colors.secondary}
                        size={24}
                    />
                </HStack>
            </Pressable>
        </>
    );
}

export const MemoGeneralForumCard = React.memo(GeneralForumCard);