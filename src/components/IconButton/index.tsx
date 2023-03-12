import { Theme } from "@/theme/theme";
import { createBox } from "@shopify/restyle";
import { TouchableOpacityProps, TouchableOpacity } from "react-native";
import { Typography } from "../ui";
import { Loading } from "../Loading/index";

type ButtonVariantType = "outlined" | "solid";

type ButtonProps = TouchableOpacityProps & {
  icon: React.ReactNode;
  variant?: ButtonVariantType;
};

const Pressable = createBox<Theme, TouchableOpacityProps>(TouchableOpacity);

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
