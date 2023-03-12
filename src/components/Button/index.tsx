import { Theme } from "@/theme/theme";
import { createBox } from "@shopify/restyle";
import { TouchableOpacityProps, TouchableOpacity } from "react-native";
import { Typography } from "../ui";
import { Loading } from "../Loading/index";

type ButtonVariantType = "outlined" | "solid";

type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: ButtonVariantType;
  isLoading?: boolean;
};

const Pressable = createBox<Theme, TouchableOpacityProps>(TouchableOpacity);

export const Button = ({
  title,
  variant = "solid",
  isLoading = false,
  ...rest
}: ButtonProps) => {
  const isOutlined = variant === "outlined";

  return (
    <Pressable
      width="100%"
      height={50}
      backgroundColor={
        !rest.disabled ? "grayFive" : isOutlined ? "transparent" : "secondary"
      }
      borderColor="primary"
      borderWidth={isOutlined ? 1 : 0}
      borderRadius={8}
      alignItems="center"
      justifyContent="center"
      {...rest}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <Typography
          color={isOutlined ? "primary" : "white"}
          variant="heading"
          fontSize={16}
        >
          {title}
        </Typography>
      )}
    </Pressable>
  );
};
