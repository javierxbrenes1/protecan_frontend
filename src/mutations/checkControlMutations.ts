import gql from 'graphql-tag';
import { cdr } from '../queries';

export const CREATE_CDR = gql`
mutation($data: CdrInput!) {
    createCdr(data: $data) {
        data {
            ${cdr}
        }
    }
}
`;

export const UPDATE_CDR = gql`
mutation($id: ID!, $data: CdrInput!) {
    updateCdr(id: $id, data: $data) {
        data {
            ${cdr}
        }
    }
}
`;

export const SEND_CRD = gql`
mutation($cdrId: ID!, $clientId: ID!) {
    sendCdrToClient(cdrId: $cdrId, clientId: $clientId) {
        data {
            ${cdr}
        }
    }
}
`

export const DELETE_CDR = gql`
mutation($id: ID!) {
    deleteCdr(id: $id) {
        data {
            id
        }
    }
}
`;

export const buildFiltersForGetCdrs = (userId?: string, client?: string, status?: string) => {
    return {
        user: { id: { eq: userId } },
        ...client ? { client: { id: { eq: client } } } : {},
        ...status ? { status: { eq: status } } : {}
    }
};