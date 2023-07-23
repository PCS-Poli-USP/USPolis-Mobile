import { Theme } from "@/theme/theme";
import { createBox } from "@shopify/restyle";
import { PressableProps, Pressable as NativePressable } from "react-native";
import { Typography } from "../ui";
import { Loading } from "../Loading/index";

type ButtonVariantType = "outlined" | "solid" | "primary" | "raw";

type ButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariantType;
  isLoading?: boolean;
};

const Pressable = createBox<Theme, PressableProps>(NativePressable);

export const Button = ({
  title,
  variant = "solid",
  isLoading = false,
  ...rest
}: ButtonProps) => {
  const backgroundColorsByType: Record<string, any> = {
    outlined: "grayFive",
    solid: "secondary",
    primary: "secondary",
    raw: "transparent"
  }

  const textColorByType: Record<string, any> = {
    outlined: "primary",
    solid: "white",
    primary: "white",
    raw: "primary",
  }

  const borderColorByType: Record<string, any> = {
    outlined: "primary",
    solid: "transparent",
    primary: "transparent",
    raw: "transparent"
  }

  const borderWithByType: Record<string, any> = {
    outlined: 1,
    solid: 0,
    primary: 0,
    raw: 0,
  }

  return (
    <Pressable
      width="100%"
      height={50}
      backgroundColor={
        !rest.disabled ? backgroundColorsByType[variant] : "grayFive"
      }
      borderColor={
        !rest.disabled ? borderColorByType[variant] : "grayThree"
      }
      borderWidth={
        !rest.disabled ? borderWithByType[variant] : borderWithByType["outlined"]
      }
      borderRadius={8}
      alignItems="center"
      justifyContent="center"
      {...rest}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <Typography
          color={
            !rest.disabled ? textColorByType[variant] : "grayThree"
          }
          variant="heading"
          fontSize={16}
        >
          {title}
        </Typography>
      )}
    </Pressable>
  );
};
