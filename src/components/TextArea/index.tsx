import { TextArea as NativeBaseTextArea, ITextAreaProps, FormControl } from 'native-base'

type TextAreaProps = ITextAreaProps & {
  errorMessage?: string | null
  variation?: 'primary' | 'secondary'
}

export const TextArea = ({ variation = 'primary', errorMessage, isInvalid, ...props }: TextAreaProps) => {
  const invalid = isInvalid || !!errorMessage
  const isSecondary = variation === 'secondary'

  return (
    <FormControl isInvalid={invalid}>
      <NativeBaseTextArea 
        bg='gray.700'
        h={100}
        autoCompleteType={true}
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