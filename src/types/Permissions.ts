import { ResourceType } from 'src/types/Resources';

// type implementations (declarations in permission.d.ts)

export enum PermissionLevel {
    Admin = 99,
    None = 0,
    Read = 1,
    Create = 2,
    Edit = 3,
    Delete = 4,
}

// NOTE: this should be kept in sync with the default permissions levels in the server TS types.
export const DefaultLevels = Object.freeze({
    [ResourceType.Site]: PermissionLevel.Read,
    [ResourceType.Project]: PermissionLevel.Create,
});

export const DefaultLevelsUnauthenticated = Object.freeze({
    [ResourceType.Site]: PermissionLevel.Read,
    [ResourceType.Project]: PermissionLevel.Read,
});
