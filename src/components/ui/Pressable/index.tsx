import { Theme } from "@/theme/theme";
import { createBox } from "@shopify/restyle";
import { Pressable as NativePressable, PressableProps } from "react-native";

export const Pressable = createBox<Theme, PressableProps>(NativePressable);
