import React from 'react'
import { Box } from "@chakra-ui/react"
interface WrapperProps {
    variant?: 'small' | 'regular';
}

export const Wrapper: React.FC<WrapperProps> = ({children, variant='regular'}) => {
        return (
            <Box 
              mt={8} 
              mx="auto" 
              maxW={variant === 'regular' ? "800px" : "400px"} 
              w="100%" 
              bg="polarNight.2"
              p={variant === 'regular' ? 7 : 5}
              borderRadius={25}
            >
                {children}
            </Box>
        );
}