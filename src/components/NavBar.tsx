import React from 'react'
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{fetching: logoutFetching},logout] = useLogoutMutation();
    const [{data, fetching}] = useMeQuery({
        pause: isServer(), //
    });
    let basic = (<NextLink href="/"><Link color="white">productos</Link></NextLink>)
    let body = basic;

    if(fetching) {//data is loading
        body = basic;
    }if(!data?.me) {
        // user is logged in
        body = 
        (<>
            {basic}
            <NextLink href='/login'>
                <Link color="white" mr={2}>login</Link>
            </NextLink>
            <NextLink href='/register'>
                <Link color="white">register</Link>
            </NextLink>
        </>);
    }else{
        body = (
            <Flex>
                {basic}
                <Box ml={2} mr={2}>
                    {data.me.username}[{data.me.userType}]
                </Box>
                <Button 
                    onClick={() => {
                        logout();
                    }} 
                    isLoading={logoutFetching}
                    variant="link">
                        logout
                </Button>
            </Flex>)
    }
    return (
        <Flex zIndex={1} position='sticky' top={0} bg="polarNight.1" p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>
        </Flex>);
}