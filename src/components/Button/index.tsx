import { Theme } from "@/theme/theme";
import { createBox } from "@shopify/restyle";
import { TouchableOpacityProps, TouchableOpacity } from "react-native";
import { Typography } from "../ui";

type ButtonVariantType = 'outlined' | 'solid'

type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: ButtonVariantType
}

const Pressable = createBox<Theme, TouchableOpacityProps>(TouchableOpacity);

export const Button = ({ title, variant = 'solid', ...rest }: ButtonProps) => {
  const isOutlined = variant === 'outlined'
 
  return (
    <Pressable 
      width='100%'
      height={32}
      backgroundColor={rest.disabled ? 'grayFive' : isOutlined ? 'transparent' : 'secondary'}
      borderColor='primary'
      borderWidth={isOutlined ? 1 : 0}
      borderRadius={8}
      {...rest}
    >
      <Typography 
        color={isOutlined ? 'primary' : 'white'}
        variant='heading' 
        fontSize={12}
      >
        {title}
      </Typography>
    </Pressable>
  )
}