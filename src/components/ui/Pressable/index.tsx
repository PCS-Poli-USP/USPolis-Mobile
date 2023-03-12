import { Theme } from "@/theme/theme";
import { createBox } from "@shopify/restyle";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

export const Pressable = createBox<Theme, TouchableOpacityProps>(TouchableOpacity);
