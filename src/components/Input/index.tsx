import { Theme } from '@/theme/theme';
import { createBox, useTheme } from '@shopify/restyle';
import { TextInput, TextInputProps } from 'react-native';
import { Box, Typography } from '../ui';

type InputProps = TextInputProps & {
  errorMessage?: string | null
  variation?: 'primary' | 'secondary'
  isInvalid?: boolean
} & React.ComponentProps<typeof StyledInput>

const StyledInput = createBox<Theme, TextInputProps>(TextInput);

export const Input = ({ variation = 'primary', errorMessage, isInvalid, ...props }: InputProps) => {
  const invalid = isInvalid || !!errorMessage
  const isSecondary = variation === 'secondary'

  const { colors } = useTheme<Theme>()

  return (
    <Box>
      <StyledInput 
        backgroundColor={invalid ? 'graySeven' : 'graySeven'}
        height={48}
        px={'s'}
        borderWidth={invalid ? 1 : isSecondary ? 1 : 0}
        borderRadius={4}
        borderColor={invalid ? "red" : isSecondary ? 'primary' : 'transparent'}
        placeholderTextColor={colors.grayThree}
        style={{ color: colors.grayOne, fontSize: 16 }}
        {...props}
      />
      <Typography fontSize={10} color="red">
        {errorMessage}
      </Typography>
    </Box>
  )
}
