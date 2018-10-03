import gql from 'graphql-tag';

export const authStatus = gql`
    query GetAuthStatus {
        auth_authenticated @client
        auth_username @client
        auth_sitePermLevel @client
    }
`;

export const isAuthenticated = gql`
    query IsAuthenticated {
        auth_authenticated @client
    }
`;
