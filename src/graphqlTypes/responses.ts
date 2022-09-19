import { CdrCollection, CdrFields, Client, User } from ".";
import { Pagination } from "../types";

export type GetClientsType = {
    usersPermissionsUser: {
        data: {
            id: string
            attributes: {
                clients: {
                    data: Client[]
                }
            }
        }
    }
};


export type UpdatePwdResponse = {
    updatePassword: {
        jwt: string,
        user: User
    }
}

export type CreateCdrResponse = {
    createCdr: {
        data: CdrCollection
    }
}

export type UpdateCdrResponse = {
    updateCdr: {
        data: CdrCollection
    }
}

export type SendCdrResponse = {
    sendCdrToClient: {
        data: CdrCollection
    }
}

export type GetCdrsResponse = {
    cdrs: {
        data: {
            id: string,
            attributes: CdrFields
        }[],
        meta: {
            pagination: Pagination
        }
    }
}


export type GetCdrResponse = {
    cdr: {
        data: CdrCollection
    }
}