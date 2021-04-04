import { Heading } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/react';
import React from 'react'
import { Wrapper } from './Wrapper';

interface TitleProps {
variant?: 'small' | 'regular';

}

export const Title: React.FC<TitleProps> = ({variant='regular'}) => {
        return (
        <Wrapper variant={variant}>
            <Flex justifyContent="center">
            <Heading color="frost.0" size="3xl">AMADIS</Heading>
            </Flex>
        </Wrapper>)
}