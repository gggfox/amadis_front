import React from 'react'
import {Formik, Form} from 'formik';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { Layout } from '../components/Layout';
import { Wrapper } from '../components/Wrapper';

const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [,login] = useLoginMutation();
    return (
        <>
        <Layout variant="small">

        <Formik
            initialValues={{ usernameOrEmail: "", password: "" }}
            onSubmit={async (values,{setErrors}) => {
                const response = await login(values);//return promise to stop infinite spinning
                if(response.data?.login.errors) {
                    setErrors(toErrorMap(response.data.login.errors));
                }else if (response.data?.login.user){
                    if(typeof router.query.next === "string") {
                        router.push(router.query.next);
                    }else{
                        router.push("/");
                    }

                }
            }}
        >
            {({isSubmitting}) => (
                <Form>
                    <InputField
                    textarea={false}
                    name="usernameOrEmail"
                    placeholder="usuario o email"
                    label="Usuario o Email"
                    />
                    <Box mt={4}>
                    <InputField
                    textarea={false}
                    name="password"
                    placeholder="contraseña"
                    label="Contraseña"
                    type="password"
                    /></Box>
            
                    <Button 
                      mt={4} 
                      type='submit' 
                      isLoading={isSubmitting} 
                      bg="frost.1"
                      w="100%"
                      borderRadius={25}
                    >
                     login 
                    </Button>
                    <Flex justifyContent="center">
                        <NextLink href="/forgot-password">
                            <Link color="frost.1" mt={3}>¿Olvidaste tu constraseña?</Link>
                        </NextLink>
                    </Flex>
                </Form>
            )}
        </Formik>
        </Layout>
        <Wrapper variant="small">
            <Flex alignItems="center" flexDirection="column">
                <Heading size="1xl" color="snowStorm.0">¿No tienes cuenta?</Heading>
                <NextLink href='/register'>
                    <Link color="frost.1">Crea una cuenta</Link>
                </NextLink>
            </Flex>
        </Wrapper>
        <br/>
        </>

        
    );
}


export default withUrqlClient(createUrqlClient)(Login);
