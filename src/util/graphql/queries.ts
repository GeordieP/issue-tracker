import gql from 'graphql-tag';

export const getUser = gql(`
    query GetUser($id: ID!) {
        user(id: $id) {
            id
            username
            email
            fullName
            bio
        }
    }
`);

export const getIssue = gql(`
    query GetIssue($id: ID!) {
        issue(id: $id) {
            id
            dateCreated
            dateUpdated
            creator { id username }
            project { id name }
            title
            body
            severity
            status
            type
            userPermissions { userID level }
        }
    }
`);

export const getIssues = gql(`
    query GetIssues {
        issues {
            id
            dateUpdated
            creator { id username }
            project { id alias name }
            title
            severity
            status
            type
        }
    }
`);

export const getIssuesForProject = gql(`
    query GetIssuesForProject($project: ID!) {
        issues(project: $project) {
            id
            dateUpdated
            creator { id username }
            project { id alias name }
            title
            severity
            status
            type
        }
    }
`);

export const getProject = gql(`
    query GetProject($id: ID, $alias: String) {
        project(id: $id, alias: $alias) {
            id
            creator { id username }
            name
            alias
            dateUpdated
            userPermissions { userID level }
        }
    }
`);

export const getProjects = gql(`
    query GetProjects($creator: ID) {
        projects(creator: $creator) {
            id
            creator { id username }
            name
            alias
            dateUpdated
        }
    }
`);

export const getComments = gql(`
    query GetComments($parent: ID!) {
        comments(parent: $parent) {
            id
            creator { id username }
            body
            userPermissions { userID level }
            dateUpdated
        }
    }
`);

export const getTasksForIssue = gql(`
    query GetTasksForIssue($parent: ID!) {
        tasks(parent: $parent) {
            id
            creator { id username }
            title
            body
            openStatus
        }
    }
`);

export const getTask = gql(`
    query GetTask($id: ID!) {
        task(id: $id) {
            id
            title
            creator { id username }
            openStatus
            body
            userPermissions { userID level }
        }
    }
`);
