import { ApolloCache } from "@apollo/react-hooks";
import { CdrCollection } from "../../graphqlTypes";
import { CreateCdrResponse, GetCdrsResponse } from "../../graphqlTypes/responses";
import { buildFiltersForGetCdrs } from "../../mutations/checkControlMutations";
import { GET_CDRS } from "../../queries";

interface Params {
    cache: ApolloCache<any>;
    data: CreateCdrResponse;
    userId: string;
}

const writeQuery = (
    doesDataExist: boolean,
    cache: ApolloCache<any>,
    variables: { filters: any },
    data: CdrCollection,
    meta: any) => {
    if (doesDataExist) {
        cache.writeQuery({
            query: GET_CDRS,
            variables,
            data: {
                cdrs: {
                    data,
                    meta
                }
            }
        });
    }
}

const checkQueryWithoutFilters = (args: Params) => {
    const vars = {
        filters: buildFiltersForGetCdrs(args.userId)
    };
    const queryWithoutFilters = args.cache.readQuery<GetCdrsResponse>({
        query: GET_CDRS,
        variables: vars
    });
    writeQuery(!!queryWithoutFilters, args.cache, vars, args.data.createCdr.data, queryWithoutFilters?.cdrs.meta);
}

const checkQuerywithOnlyStatus = (args: Params) => {
    const vars = {
        filters: buildFiltersForGetCdrs(args.userId, undefined, args.data.createCdr.data.attributes.status)
    };
    const queryWithStatus = args.cache.readQuery<GetCdrsResponse>({
        query: GET_CDRS,
        variables: vars
    });
    writeQuery(!!queryWithStatus, args.cache, vars, args.data.createCdr.data, queryWithStatus?.cdrs.meta);
}

const checkQueryWithOnlyClient = (args: Params & { client?: string }) => {
    if (!args.client) return;
    const vars = {
        filters: buildFiltersForGetCdrs(args.userId, args.client)
    };
    const queryWithClient = args.cache.readQuery<GetCdrsResponse>({
        query: GET_CDRS,
        variables: vars
    });
    writeQuery(!!queryWithClient, args.cache, vars, args.data.createCdr.data, queryWithClient?.cdrs.meta);
}

const checkQueryWithStatusAndClient = (args: Params & { client?: string }) => {
    if (!args.client) return;

    const vars = {
        filters: buildFiltersForGetCdrs(args.userId, args.client, args.data.createCdr.data.attributes.status)
    };
    const query = args.cache.readQuery<GetCdrsResponse>({
        query: GET_CDRS,
        variables: vars
    });
    writeQuery(!!query, args.cache, vars, args.data.createCdr.data, query?.cdrs.meta);
}

export const handleUpdateToCdrCache = (
    cache: ApolloCache<any>,
    data: CreateCdrResponse | null | undefined,
    userId?: string,
    clientId?: string): void => {

    if (!data || !userId) return;

    try {
        const args = { cache, data, userId };
        checkQueryWithoutFilters(args);
        checkQuerywithOnlyStatus(args);
        checkQueryWithOnlyClient({ ...args, client: clientId });
        checkQueryWithStatusAndClient({ ...args, client: clientId })
    } catch (err) {
        console.log(err);
    }
}