import gql from 'graphql-tag';

const userLoginResponse = `
jwt,
        user {
            id
            username
            email
            name
            isUsingDefaultPwd
            role {
                id
                name
                type
            }
        }
`

export const LOGIN = gql`
mutation login($identifier: String!, $password: String!) {
    login(input: {
        identifier: $identifier
        password: $password
    }) {
        ${userLoginResponse}
    }
}
`;

export const UPDATE_PWD = gql`
mutation updatePassword($userId: ID!, $currentPassword: String!, $password: String!) {
    updatePassword(userId: $userId, currentPassword: $currentPassword, password: $password) {
        ${userLoginResponse}
    }
}
`;