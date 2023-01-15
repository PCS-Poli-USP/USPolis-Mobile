import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base'

type InputProps = IInputProps & {
  errorMessage?: string | null
}

export const Input = ({ errorMessage, isInvalid, ...props }: InputProps) => {
  const invalid = isInvalid || !!errorMessage

  return (
    <FormControl isInvalid={invalid}>
      <NativeBaseInput 
        bg='gray.700'
        h={14}
        px={4}
        borderWidth={0}
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