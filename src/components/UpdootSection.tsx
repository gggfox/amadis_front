import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react'
import { PostsQuery, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
    post: PostsQuery["posts"]["posts"][0]
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({post}) => {
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading');
    const [, vote] = useVoteMutation();
    return (
            <Flex flexDirection="column" mr={3} alignItems="center">
                <IconButton
                    icon={<ArrowUpIcon/>} 
                    aria-label="Updoot post"
                    
                    onClick={async () => {
                        if(post.voteStatus === 1) {
                            return;
                        }
                        setLoadingState('updoot-loading')
                        await vote({
                            postId: post.id,
                            value: 1,
                        });
                        setLoadingState('not-loading');
                    }} 
                    colorScheme={post.voteStatus === 1 ? "green" : undefined}
                    isLoading={loadingState==='updoot-loading'}
                    />
                <div>{post.points}</div>
                <IconButton
                    icon={<ArrowDownIcon/>} 
                    aria-label="Downdoot post"
                    onClick={async () => {
                        if(post.voteStatus === -1) {
                            return;
                        }
                        setLoadingState('downdoot-loading')
                        await vote({
                            postId: post.id,
                            value: -1,
                        })
                        
                        setLoadingState('not-loading');
                    }}
                    colorScheme={post.voteStatus === -1 ? "red" : undefined}
                    isLoading={loadingState==='downdoot-loading'}
                    />
            </Flex>
    );
}