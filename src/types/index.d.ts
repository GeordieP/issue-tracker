//
// ID
// Type to represent IDs for database documents.
//-------------------------------------------

declare type ID = string | number;

//
// RouteParams
// Valid URL parameters for react-router routes.
//-------------------------------------------

declare interface RouteParams {
    projectID: string;
    issueID: string;
    taskID: string;
    userID: string;
}
