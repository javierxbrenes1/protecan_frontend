import { EntranceComponent, RevisionComponent } from "../graphqlTypes"

export type CdrEntry = {
    id: string,
    composedId: string,
    status: string,
    clientCdrNumber: number,
    createDate: Date | null,
    client: {
        id: string,
        name: string,
        active: boolean
    },
    entrance: EntranceComponent | null,
    revision: RevisionComponent | null,
    report: {
        name: string,
        url: string
    } | null
}

export type Pagination = {
    total: number,
    page: number,
    pageSize: number,
    pageCount: number
}