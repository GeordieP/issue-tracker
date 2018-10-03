import gql from 'graphql-tag';

export const updateUser = gql(`
    mutation UpdateUser($id: ID!, $username: String, $email: String, $fullName: String, $bio: String) {
        updateUser(id: $id, username: $username, email: $email, fullName: $fullName, bio: $bio) {
            id
            username
            email
            fullName
            bio
        }
    }
`);

export const deleteUser = gql(`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
    }
`);

export const createProject = gql(`
    mutation CreateProject($name: String!, $alias: String!) {
        createProject(name: $name, alias: $alias) {
            id
            creator { id username }
            name
            alias
            dateUpdated
        }
    }
`);

export const updateProject = gql(`
    mutation UpdateProject($id: ID!, $name: String, $creator: ID, $alias: String) {
        updateProject(id: $id, creator: $creator, name: $name, alias: $alias) {
            id
            creator { id username }
            name
            alias
            dateUpdated
        }
    }
`);

export const deleteProject = gql(`
    mutation DeleteProject($id: ID!) {
        deleteProject(id: $id)
    }
`);

export const updateIssue = gql(`
    mutation UpdateIssue($id: ID!, $title: String, $body: String, $severity: String, $status: String, $type: String) {
        updateIssue(id: $id, title: $title, body: $body, severity: $severity, status: $status, type: $type) {
            id
            dateCreated
            dateUpdated
            creator { id username }
            title
            body
            severity
            status
            type
        }
    }
`);

export const createIssue = gql(`
    mutation CreateIssue($title: String!, $body: String, $severity: String!, $type: String!, $project: ID!) {
        createIssue(title: $title, body: $body, severity: $severity, type: $type project: $project) {
            id
            dateUpdated
            creator { id username }
            title
            severity
            status
            type
        }
    }
`);

export const deleteIssue = gql(`
    mutation DeleteIssue($id: ID!) {
        deleteIssue(id: $id)
    }
`);

export const createComment = gql(`
    mutation CreateComment($parent: ID!, $body: String!, $parentType: CommentParentType!) {
        createComment(parent: $parent, body: $body, parentType: $parentType) {
            id
            creator { id username }
            body
        }
    }
`);

export const updateComment = gql(`
    mutation UpdateComment($id: ID!, $body: String!) {
        updateComment(id: $id, body: $body) {
            id
            creator { id username }
            body
        }
    }
`);

export const deleteComment = gql(`
    mutation DeleteComment($id: ID!) {
        deleteComment(id: $id)
    }
`);

export const createTask = gql(`
    mutation CreateTask($title: String!, $body: String, $parent: ID!, $openStatus: Boolean) {
        createTask(title: $title, body: $body, parent: $parent, openStatus: $openStatus) {
            id
        }
    }
`);

export const deleteTask = gql(`
    mutation DeleteTask($id: ID!) {
        deleteTask(id: $id)
    }
`);

export const updateTask = gql(`
    mutation UpdateTask($id: ID!, $title: String, $body: String, $openStatus: Boolean) {
        updateTask(id: $id, title: $title, body: $body, openStatus: $openStatus) {
            id
            title
            body
            openStatus
        }
    }
`);
