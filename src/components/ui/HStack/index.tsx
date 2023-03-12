import React from "react"
import { Box } from "../Box"

type HStackProps = React.ComponentProps<typeof Box>

export const HStack = (props: HStackProps) => {
  return (
    <Box
      {...props}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    />
  )
}