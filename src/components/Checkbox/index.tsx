import { Theme } from "@/theme/theme";
import FeatherIcons from "@expo/vector-icons/Feather";
import { useTheme } from "@shopify/restyle";
import { TouchableOpacity } from "react-native";
import { Box } from "../ui";

interface ICheckboxProps {
  selected: boolean;
  onPress: () => void;
}

export const Checkbox = ({ selected, onPress }: ICheckboxProps) => {
  const theme = useTheme<Theme>()

  return (
    <TouchableOpacity onPress={onPress}>
      <Box 
        backgroundColor="graySix" 
        height={32} 
        width={32} 
        borderRadius={8} 
        alignItems="center" 
        justifyContent="center"
        borderWidth={1}
        borderColor={selected ? 'primary' : 'grayFive'}
      >
        {selected && (
          <FeatherIcons name="check" color={theme.colors.primary} size={24} />
        )}
      </Box>
    </TouchableOpacity>
  )
}