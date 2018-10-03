import * as React from 'react';
import { Switch, Route, Link, match } from 'react-router-dom';
import { Query, QueryResult } from 'react-apollo';
import gql from 'graphql-tag';
import { authStatus } from 'src/util/graphql/clientQueries';

import { PermissionLevel } from 'src/types/Permissions';

// components
import PermittedRender from 'src/containers/Permissions/PermittedRender';

const GetProjPerms = gql`
    query GetProjectPermissions($id: ID!) {
        project(id: $id) {
            id
            userPermissions { level }
        }
    }
`;

interface Props {
    match: match<RouteParams>
}

// new issue button needs access to the current project to check permissions.
const NewIssueBtn = ({ match: { params } }: Props) => (
    <Query query={GetProjPerms} variables={{ id: params.projectID }}>
        {({ loading, error, data }: QueryResult) => {
            if (loading) return null;
            if (error) {
                console.log('Error in NavbarRoutes: ', error);
                return null;
            }

            return (
                <PermittedRender requiredLevel={PermissionLevel.Create} resource={data.project}>
                    <Link
                        to={`/projects/${params.projectID}/newIssue`}
                        className='u-flexV u-centerAll'>
                        <li>+ New Issue</li>
                    </Link>
                </PermittedRender>
            );
        }}
    </Query>
);

// new project button needs to check site permissions.
const NewProjectBtn = () => (
    <Query query={authStatus}>
        {({ loading, error, data }: QueryResult) => {
            if (loading) return null;
            if (error) {
                console.log('Error in NavbarRoutes: ', error);
                return null;
            }

            if (data.auth_authenticated === false || data.auth_sitePermLevel == null)
                return null

            // need Create for site or above to create a new project
            if (data.auth_sitePermLevel > PermissionLevel.Create)
                return (
                    <Link to="/newProject" className='u-flexV u-centerAll'>
                        <li>+ New Project</li>
                    </Link>
                )

            return null
        }}
    </Query>
);

export default () => (
    <Switch>
        <Route path='/' exact={true} component={NewProjectBtn} />
        <Route path='/projects' exact={true} component={NewProjectBtn} />
        <Route path='/projects/:projectID' component={NewIssueBtn} />
        <Route path='/projectDetails/:projectID' component={NewIssueBtn} />
    </Switch>
);
