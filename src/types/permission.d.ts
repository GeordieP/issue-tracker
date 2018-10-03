declare enum PermissionLevel {
    Admin = 99,
    None = 0,
    Read = 1,
    Create = 2,
    Edit = 3,
    Delete = 4,
}

declare interface Permission {
    id: ID;
    level: PermissionLevel;
    userID?: ID;
    resourceID?: ID;
}
