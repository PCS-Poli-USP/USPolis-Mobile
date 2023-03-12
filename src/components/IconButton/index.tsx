import { Theme } from "@/theme/theme";
import { createBox } from "@shopify/restyle";
import { PressableProps, Pressable as NativePressable } from "react-native";

type ButtonVariantType = "outlined" | "solid";

type ButtonProps = PressableProps & {
  icon: React.ReactNode;
  variant?: ButtonVariantType;
};

const Pressable = createBox<Theme, PressableProps>(NativePressable);

export const IconButton = ({
  icon,
  variant = "solid",
  ...rest
}: ButtonProps) => {
  const isOutlined = variant === "outlined";

  return (
    <Pressable
      backgroundColor={
        !rest.disabled ? "grayFive" : isOutlined ? "transparent" : "secondary"
      }
      borderColor="grayThree"
      borderWidth={1}
      borderRadius={1000}
      alignItems="center"
      justifyContent="center"
      padding="s"
      {...rest}
    >
      {icon}
    </Pressable>
  );
};
