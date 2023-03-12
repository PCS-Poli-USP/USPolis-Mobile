import { Box, Typography, VStack } from "@/components";

export const Profile = () => {
  return (
    <VStack flex={1} backgroundColor='graySeven' paddingHorizontal="m" paddingBottom={'l'}>
      <Box marginVertical="l" alignItems="center" justifyContent="center">
        <Typography variant={'heading'} color='grayOne' fontSize={24} ml={'s'}>USPolis</Typography>
      </Box>

      <Box marginVertical="l" alignItems="center" justifyContent="center">
        <Typography variant={'heading'} color='grayOne' fontSize={18} ml={'s'}>Perfil</Typography>
      </Box>
    </VStack>
  );
};