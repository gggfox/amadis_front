import React from 'react'
import {Formik, Form} from 'formik';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import { Wrapper } from "../components/Wrapper";
import { InputField } from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Layout } from '../components/Layout';
import NextLink from 'next/link';
interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [,register] = useRegisterMutation();
    return (
        <>
        <Layout variant="small">
        <Formik
            initialValues={{ email: "", username: "", password: "" }}
            onSubmit={async (values,{setErrors}) => {
                console.log(values);
                const response = await register({options: values});//return promise to stop infinite spinning
                if(response.data?.register.errors) {
                    setErrors(toErrorMap(response.data.register.errors));
                }else if (response.data?.register.user){
                    router.push('/');

                }
            }}
        >
            {({isSubmitting}) => (
                <Form>
                    <InputField
                    name="username"
                    placeholder="usuario"
                    label="Usuario"
                    />
                    <Box mt={4}>
                        <InputField name="email" placeholder="email" label="Email"/>
                    </Box>
                    <Box mt={4}>
                    <InputField
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
                        Crear Cuenta
                    </Button>

                </Form>
            )}
        </Formik>
        </Layout>

        <Wrapper variant="small">
             <Flex alignItems="center" flexDirection="column">
                <Heading size="1xl" color="snowStorm.0">¿Ya tienes cuenta?</Heading>
                <NextLink href='/login'>
                    <Link color="frost.1">Ingresa a tu cuenta</Link>
                </NextLink>
            </Flex> 
        </Wrapper>
        <br/>
        </>
    );
}

export default withUrqlClient(createUrqlClient)(Register);//no ssr