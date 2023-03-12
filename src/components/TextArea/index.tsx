import { Theme } from "@/theme/theme";
import { createBox } from "@shopify/restyle";
import { TextInput, TextInputProps } from "react-native";
import { Box, Typography } from "../ui";

type InputProps = TextInputProps & {
  errorMessage?: string | null;
  variation?: "primary" | "secondary";
  isInvalid?: boolean;
} & React.ComponentProps<typeof StyledInput>;

const StyledInput = createBox<Theme, TextInputProps>(TextInput);

export const TextArea = ({
  variation = "primary",
  errorMessage,
  isInvalid,
  ...props
}: InputProps) => {
  const invalid = isInvalid || !!errorMessage;
  const isSecondary = variation === "secondary";

  return (
    <Box>
      <StyledInput
        numberOfLines={10}
        backgroundColor={invalid ? "graySeven" : "graySeven"}
        height={100}
        px="s"
        borderWidth={invalid ? 1 : isSecondary ? 1 : 0}
        borderColor={invalid ? "red" : isSecondary ? "primary" : "transparent"}
        placeholderTextColor="grayThree"
        style={{ color: "white", fontSize: 16 }}
        borderRadius={5}
        multiline
        {...props}
      />
      <Typography fontSize={10} color="red">
        {errorMessage}
      </Typography>
    </Box>
  );
};
