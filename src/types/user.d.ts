declare interface User {
    __typename?: string;
    id: ID;
    joinDate: number;
    username: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    bio?: string;
    homePage?: string;
}
