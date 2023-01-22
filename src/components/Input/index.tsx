import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base'

type InputProps = IInputProps & {
  errorMessage?: string | null
  variation?: 'primary' | 'secondary'
}

export const Input = ({ variation = 'primary', errorMessage, isInvalid, ...props }: InputProps) => {
  const invalid = isInvalid || !!errorMessage
  const isSecondary = variation === 'secondary'

  return (
    <FormControl isInvalid={invalid}>
      <NativeBaseInput 
        bg='gray.700'
        h={14}
        px={4}
        borderWidth={isSecondary ? 1 : 0}
        borderColor={isSecondary ? 'green.500' : 'transparent'}
        fontSize='md'
        color='white'
        fontFamily='body'
        isInvalid={invalid}
        placeholderTextColor={'gray.300'}
        _invalid={{
          bg: 'gray.700',
          borderWidth: 1,
          borderColor: 'red.500',
        }}
        _focus={{
          bg: 'gray.700',
          borderWidth: 1,
          borderColor: 'green.500'
        }}
        {...props}
      />
      <FormControl.ErrorMessage>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}