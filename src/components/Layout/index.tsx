import { Theme } from "@/theme/theme";
import { useTheme } from "@shopify/restyle";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { Platform } from "react-native";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const { colors } = useTheme<Theme>();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1}}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: colors.graySeven }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
