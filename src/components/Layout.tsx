import { Box } from '@chakra-ui/react';
import React from 'react'
import { NavBar } from './NavBar'
import { Title } from './Title';
import { Wrapper } from './Wrapper';

export type WrapperVariant = "small" | "regular";

interface LayoutProps {
    variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({children, variant}:any) => {
        return (
            <Box bg="polarNight.0" h="100%">
                <NavBar/>

                <Title variant={variant}/>
                <Wrapper variant={variant}>
                    {children}
                </Wrapper>
            </Box>
            );
}