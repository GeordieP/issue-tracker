//
// Resource (base)
//-------------------------------------------

declare interface Resource {
    __typename?: string;
    id: ID;
    creator: User
    dateCreated: number;
    dateUpdated: number;
    userPermissions?: Permission
}

declare enum ResourceType {
    Site = '__SITE',
    Project = 'PROJECT',
}

//
// Project
//-------------------------------------------

declare interface Project extends Resource {
    name: string;
    alias: string;
}

//
// Issue
//-------------------------------------------

declare interface Issue extends Resource {
    title: string;
    body: string;
    severity: string;
    status: string;
    type: string;
    project: Project;
    tags: string[];
}

//
// Task
//-------------------------------------------

declare interface Task extends Resource {
    title: string;
    body: string;
    parent: Issue;
    openStatus: boolean;
}

//
// Comment
//-------------------------------------------

declare type CommentParent = Issue | Task;

declare enum CommentParentType {
    ISSUE = 'ISSUE',
    TASK = 'TASK',
}

declare interface Comment extends Resource {
    body: string;
    parent: CommentParent;
    parentType: CommentParentType;
}
