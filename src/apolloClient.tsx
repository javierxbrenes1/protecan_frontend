import { USER_JWT } from './constants&Types';
import * as SecureStore from 'expo-secure-store';
import enviroment from './manifest';
import { ApolloClient, createHttpLink, InMemoryCache, InMemoryCacheConfig } from '@apollo/react-hooks';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: enviroment.GRAPHQL_URL
});
const authLink = setContext(async (_, { headers }) => {
    const token = await SecureStore.getItemAsync(USER_JWT);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const inMemoryProps: InMemoryCacheConfig = {
    typePolicies: {
        Query: {
            fields: {
                cdrs: {
                    keyArgs: ['filters'],
                    merge(existing = { data: [] }, incoming: any, here) {
                        // I need to do this in order to insert a new cdr the user creates at the beginning
                        if (!Array.isArray(incoming.data)) {
                            return {
                                data: [incoming.data, ...existing.data],
                                meta: incoming.meta
                            };
                        }
                        return {
                            data: [...existing.data, ...incoming.data],
                            meta: incoming.meta
                        };
                    }
                }
            }
        }
    }
}

let apolloClient = new ApolloClient({ link: authLink.concat(httpLink), cache: new InMemoryCache(inMemoryProps) });

export const resetApolloClient = () => {
    apolloClient = new ApolloClient({ link: authLink.concat(httpLink), cache: new InMemoryCache(inMemoryProps) });
}

export default apolloClient;