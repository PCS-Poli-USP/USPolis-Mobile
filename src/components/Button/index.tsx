import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base'

type ButtonVariantType = 'outlined' | 'solid'

type ButtonProps = IButtonProps & {
  title: string;
  variant?: ButtonVariantType
}

export const Button = ({ title, variant = 'solid', ...rest }: ButtonProps) => {
  const isOutlined = variant === 'outlined'
 
  return (
    <NativeBaseButton 
      w='full'
      h={14}
      bg={isOutlined ? 'transparent' : 'green.700'}
      borderColor='green.500'
      borderWidth={isOutlined ? 1 : 0}
      rounded='sm'
      _disabled={{
        bg: 'gray.400'
      }}
      _pressed={{
        bg: isOutlined ? 'gray.500' : 'green.500'
      }}
      {...rest}
    >
      <Text 
        color={isOutlined ? 'green.500' : 'white'}
        fontFamily='heading' 
        fontSize='sm'
      >
        {title}
      </Text>
    </NativeBaseButton>
  )
}