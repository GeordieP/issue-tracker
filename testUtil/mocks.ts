import { PermissionLevel } from 'src/types/Permissions';
import { CommentParentType } from 'src/types/Comments';

const commonDate = Date.now();

export const permissionMock: Permission = {
    id: 'pm01',
    level: PermissionLevel.Admin,
    userID: 'u01',
    resourceID: 'p01',
};

export const userMock: User = {
    __typename: 'User',
    id: 'u01',
    joinDate: commonDate,
    username: 'test user',
    email: 'u01@testuser.com',
    fullName: 'Test User One',
};

export const projectMock: Project = {
    __typename: 'Project',
    id: 'p01',
    creator: userMock,
    dateCreated: commonDate,
    dateUpdated: commonDate,
    userPermissions: permissionMock,
    name: 'test project name',
    alias: 'TSTPRJNM',
};

export const issueMock: Issue = {
    __typename: 'Issue',
    id: 'i01',
    creator: userMock,
    dateUpdated: commonDate,
    dateCreated: commonDate,
    userPermissions: permissionMock,

    title: 'test issue title',
    body: 'test issue body',
    severity: 'high',
    status: 'open',
    type: 'bug',
    project: projectMock,
    tags: [],
};

export const taskMock: Task = {
    __typename: 'Task',
    id: 't01',
    creator: userMock,
    dateUpdated: commonDate,
    dateCreated: commonDate,
    userPermissions: permissionMock,

    title: 'test task title',
    body: 'test task body',
    parent: issueMock,
    openStatus: true,
};

export const commentMock: any = {
    __typename: 'Comment',
    id: 'c01',
    creator: userMock,
    dateCreated: commonDate,
    dateUpdated: commonDate,
    userPermissions: permissionMock,

    body: 'comment body',
    parent: issueMock,
    parentType: CommentParentType.ISSUE,
};

export const extraPropsMock = {
    title: '--test--title',
    className: '--test--className',
};
