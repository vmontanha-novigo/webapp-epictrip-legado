import React from 'react'
import { Button, ButtonProps } from "@chakra-ui/react";

export default function RoundButton ({children, ...rest}: ButtonProps) {
  return (
    <Button {...rest} size="lg" backgroundColor="orange.500" _hover={{backgroundColor: 'orange.700'}} borderWidth="3px" color="white" borderColor="white">{children}</Button>
  )
}
