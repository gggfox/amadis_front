import { withUrqlClient } from "next-urql"
import React, { useState } from "react"
import { Layout } from "../components/Layout"
import { usePostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import NextLink from "next/link";
import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react"
import { UpdootSection } from "../components/UpdootSection"

const Index = () => {
   const [variables, setVariables] = useState({
      limit: 10, 
      cursor: null as string | null
   });

 const [{data, fetching}] = usePostsQuery({
    variables,
 });
 if(!fetching && !data){//done loading and no data
    return <div>you got no posts for some reason</div>
 }
    return(
 <Layout>
    <Flex align="center">
      <Heading color="snowStorm.0">Productos</Heading>
      <NextLink href="/create-post">
         <Link ml="auto" color="snowStorm.0">
            crear producto
         </Link>
      </NextLink>
    </Flex>
    {!data && fetching 
      ? (<div>loading...</div>) 
      : (<Stack spacing={8}>
            {data!.posts.posts.map((p) => (
               <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  <UpdootSection post={p}/>
                  <Box>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                     <Heading fontSize="xl" color="snowStorm.1">
                        {p.title}
                     </Heading>
                  </Link>
                  </NextLink>
                  <Text>
                     vendedor: {p.creator.username}
                  </Text>
                  <Text mt={2} color="snowStorm.1">{p.textSnippet}...</Text>
                </Box>
               </Flex>
            ))}
         </Stack>)
    }
    {data ? (
    <Flex>
      <Button onClick={() => {
         setVariables({
            limit: variables.limit,
            cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
         });
      }} m="auto" my={4}>Load more</Button>
    </Flex> 
    ): null}
 </Layout>
)}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)//has ssr