export default `
    # Timestamp type is serialized automatically when sent from our resolvers.
    # It should be a JS timestamp integer (i.e. the result of Date.now())
    scalar Timestamp

    enum CommentParentType {
        ISSUE
        TASK
    }

    type Permission {
        id: ID!
        userID: ID
        level: Int!
        resourceID: ID
    }

    interface Resource {
        id: ID!
        dateCreated: Timestamp!
        dateUpdated: Timestamp!
        creator: User
        userPermissions: Permission
    }

    union CParentType = Issue | Task
    interface Comment {
        id: ID!
        dateCreated: Timestamp!
        dateUpdated: Timestamp!
        creator: User
        body: String!
        parent: CParentType!
        parentType: CommentParentType!
        userPermissions: Permission
    }

    type User {
        id: ID!
        joinDate: Timestamp!
        username: String!
        email: String!
        fullName: String!
        avatarUrl: String
        bio: String
        homepage: String
    }

    type Project implements Resource {
        id: ID!
        dateCreated: Timestamp!
        dateUpdated: Timestamp!
        creator: User
        name: String!
        alias: String!
        userPermissions: Permission
    }

    type Issue implements Resource {
        id: ID!
        dateCreated: Timestamp!
        dateUpdated: Timestamp!
        creator: User
        title: String!
        body: String
        severity: String!
        status: String!
        type: String!
        project: Project!
        tags: [String]!
        userPermissions: Permission
    }

    type Task implements Resource {
        id: ID!
        dateCreated: Timestamp!
        dateUpdated: Timestamp!
        creator: User
        title: String!
        body: String
        parent: Issue!
        openStatus: Boolean!
        userPermissions: Permission
    }

    type IssueComment implements Resource & Comment {
        id: ID!
        dateCreated: Timestamp!
        dateUpdated: Timestamp!
        creator: User
        body: String!
        parent: Issue!
        parentType: CommentParentType!
        userPermissions: Permission
    }

    type TaskComment implements Resource & Comment {
        id: ID!
        dateCreated: Timestamp!
        dateUpdated: Timestamp!
        creator: User
        body: String!
        parent: Task!
        parentType: CommentParentType!
        userPermissions: Permission
    }

    type Query {
        users: [User]!
        user(id: ID, email: String, username: String): User

        projects(creator: ID): [Project]
        project(id: ID, alias: String): Project

        issues(project: ID, creator: ID): [Issue]
        issue(id: ID!): Issue

        tasks(parent: ID!): [Task]
        task(id: ID!): Task

        comments(creator: ID, parent: ID): [Comment]
        comment(id: ID!): Comment
    }

    type Mutation {
        # TEMP
        createPermission(userID: ID!, resourceID: ID!, level: Int!): Permission

        updateUser(id: ID!, username: String, email: String, fullName: String, avatarUrl: String, bio: String, homepage: String): User
        deleteUser(id: ID!): ID

        createProject(name: String!, alias: String!): Project
        updateProject(id: ID!, creator: ID, name: String, alias: String): Project
        deleteProject(id: ID!): ID

        createIssue(title: String!, body: String, severity: String!, status: String = "Open", type: String!, project: ID!, tags: [String] = []): Issue
        updateIssue(id: ID!, title: String, body: String, severity: String, status: String, type: String, project: ID, tags: [String]): Issue
        deleteIssue(id: ID!): ID

        createComment(parent: ID!, parentType: CommentParentType!, body: String!): Comment
        updateComment(id: ID!, body: String!): Comment
        deleteComment(id: ID!): ID

        createTask(title: String!, body: String, parent: ID!, openStatus: Boolean = true): Task
        updateTask(id: ID!, title: String, body: String, openStatus: Boolean): Task
        deleteTask(id: ID!): ID
    }

    schema {
        query: Query
        mutation: Mutation
    }
`;
