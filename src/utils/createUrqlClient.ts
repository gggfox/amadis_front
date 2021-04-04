import { dedupExchange, fetchExchange, Exchange, stringifyVariables } from "@urql/core"
import { cacheExchange, Resolver } from "@urql/exchange-graphcache"
import Router from "next/router"
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, VoteMutationVariables } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery"
import {pipe, tap} from 'wonka';
import gql from "graphql-tag"
import { isServer } from "./isServer"


const errorExchange: Exchange = ({ forward }) => (ops$) => {
    return pipe(
        forward(ops$),
        tap(({error}:any) => {
            if(error?.message.includes("not authenticated")) {
                Router.replace("/login");
            }
        })
    )
};

const cursorPagination = (): Resolver =>{
    return(_parent, fieldArgs, cache, info) => {
        const {parentKey: entityKey, fieldName} = info;

        const allFields = cache.inspectFields(entityKey);
        const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
        const size = fieldInfos.length;
        if(size === 0) {
            return undefined;
        }

        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
        const isItInTheCache = cache.resolve(
            cache.resolveFieldByKey(entityKey, fieldKey) as string,
            "posts"
        );
        info.partial = !isItInTheCache;

        let hasMore = true;
        const results: string[] = [];
        fieldInfos.forEach(fi => {
            const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
            const data = cache.resolve(key, "posts")as string[];
            const _hasMore = cache.resolve(key, "hasMore");
            if(!_hasMore){
                hasMore = _hasMore as boolean;
            }
            results.push(...data);
        });
        return {
            __typename: "PaginatedPosts",
            hasMore,
            posts: results,
        }
    }
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
    let cookie = '';
    if(isServer()){
        cookie = ctx.req.headers.cookie;
    }
    return{
    url:'http://localhost:4002/graphql',
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookie
      ? {
            cookie,
        }
      : undefined,
    },
    exchanges: [ 
        dedupExchange, 
        cacheExchange({
            keys:{
                PaginatedPosts: () => null
            },
            resolvers: {
                Query: {
                    posts: cursorPagination(),
                },
            },
            updates:{
                Mutation: {
                vote: (_result, args, cache, info) => {
                    const {postId, value } = args as VoteMutationVariables;
                    const data = cache.readFragment(
                        gql`
                        fragment _ on Post {
                            id
                            points
                            voteStatus
                        }
                        `,
                        {id: postId} as any
                    );
                    if(data){
                        if(data.voteStatus === value){
                            return;
                        }
                        const newPoints = (data.points as number) + ((!data.voteStatus ? 1 : 2)*value);
                        cache.writeFragment(
                            gql`
                            fragment __ on Post {
                                points
                                voteStatus
                            }
                        `,
                        {id: postId, points: newPoints, voteStatus: value} as any );
                    }
                
                },
                createPost:  (_result, args, cache:any, info) => {
                    const allFields = cache.inspectFields('Query');
                    const fieldInfos = allFields.filter((info:any) => info.fieldName === 'posts');
                    fieldInfos.forEach((fi:any) => {
                        cache.invalidate('Query', 'posts', fi.arguments || {});
                    });
                },
                logout: (_result, args, cache:any, info) => {
                    betterUpdateQuery<LogoutMutation, MeQuery>(
                    cache,
                    {query: MeDocument},
                    _result,
                    () => ({me: null})
                    );
                },
                login: (_result, args, cache:any, info) => {
                    betterUpdateQuery<LoginMutation, MeQuery>(
                    cache, 
                    {query: MeDocument},
                    _result, 
                    (result, query) => {
                        if(result.login.errors) {
                        return query;
                        }else {
                        return {
                            me: result.login.user,
                        };
                        }
                    }
                    );
                },
        
                register: (_result, args, cache:any, info) => {
                    betterUpdateQuery<RegisterMutation, MeQuery>(
                    cache, 
                    {query: MeDocument},
                    _result, 
                    (result, query) => {
                        if(result.register.errors) {
                        return query;
                        }else {
                        return {
                            me: result.register.user,
                        };
                        }
                    }
                    );
                },
                },
            }
            }),
    errorExchange,
    ssrExchange,
    fetchExchange]
}};

