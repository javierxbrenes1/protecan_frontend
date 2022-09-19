import { StringValueNode } from "graphql";

export type UserRole = {
    id: string;
    name: string;
    type: string;
}

export type User = {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    name: string;
    isUsingDefaultPwd: string;
}

export type Client = {
    name: string;
    identification?: string;
}


export type EntranceComponent = {
    containerNumber: string,
    driver: string
    identification: string,
    identificationType: string,
    observations: string,
    transporter: string,
    truckCountry: string,
    truckPlate: string,
    vehicleType: string,
    buildingType: string,
    place: string
}

export type RevisionComponent = {
    startAt?: string,
    endAt?: string,
    date?: Date,
    guideName: string,
    revisionLabelNumber: string,
    canName: string,
    canChipNumber: string,
    result?: string,
    findingPlaceDescription: string
}


export type CdrFields = {
    status: string,
    createDate: Date | null,
    clientCdrNumber: number,
    client: {
        data: {
            id: string,
            attributes: {
                name: string,
                active: boolean,
            }
        }
    },
    entrance: EntranceComponent & { __typename?: string } | null,
    revision: RevisionComponent & { __typename?: string } | null,
    report: {
        data: {
            attributes: {
                name: string
                url: string
            }
        }
    } | null
};

export type CdrCollection = {
    id: string,
    attributes: CdrFields
}
