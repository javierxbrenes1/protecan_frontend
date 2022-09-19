import gql from 'graphql-tag';

export const GET_ME = gql`
query {
    me {
      id
      username
      email
      name
      role {
        id
        name
        type
      }
      isUsingDefaultPwd
    }
  }
`


export const GET_CLIENTS = gql`
query($id: ID) {
  usersPermissionsUser(id:$id) {
    data {
      attributes {
        clients(filters:{active:{eq:true}}){
          data {
            id
            attributes {
              name
            }
          }
        }
      }
    }
  }
}
`
const entranceFields = `
driver
identificationType
identification
transporter
truckPlate
truckCountry
containerNumber
observations
vehicleType
buildingType
place
`;

const revisionFields = `
startAt
endAt
guideName
revisionLabelNumber
canName
canChipNumber
date
result
findingPlaceDescription
`;

const cdrFields = `
status
createDate
clientCdrNumber
client {
  data {
    id
    attributes {
     name
     active
    }
  }
}
`

export const cdr = `
id
attributes {
  ${cdrFields}
  entrance {
    ${entranceFields}
  }
  revision {
    ${revisionFields}
  }
  report {
    data {
      attributes {
        name
        url
      }
    }
  }
}
`;


export const GET_CDRS = gql`
query($filters: CdrFiltersInput, $page:Int, $pageSize:Int) {
  cdrs(filters: $filters, pagination: { page: $page, pageSize: $pageSize }, sort: ["createdAt:desc"]) {
    data {
      ${cdr}
    }
    meta {
      pagination {
        total
        page
        pageSize
        pageCount
      }
    }
  }
}
`

export const GET_CDR = gql`
query($id: ID!) {
  cdr(id: $id) {
    data {
      ${cdr}
    }
  }
}
`;
