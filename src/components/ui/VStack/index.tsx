import { Box } from "../Box";

export const VStack = ({ children, ...props }: VStackProps) => {
  return (
    <Box {...props} flexDirection="column">
      {children}
    </Box>
  );
};

interface VStackProps extends React.ComponentProps<typeof Box> {
  children: React.ReactNode;
}
