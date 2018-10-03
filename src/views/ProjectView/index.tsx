import * as React from 'react';
import { Query, QueryResult} from 'react-apollo';
import { Redirect, match as Match } from 'react-router-dom';
import { getProject } from 'src/util/graphql/queries';

// types
import { PermissionLevel } from 'src/types/Permissions';

// components
import NotPermittedRender from 'src/containers/Permissions/NotPermittedRender';
import LoadingSpinner from 'src/components/LoadingSpinner';
import LoadingError from 'src/components/LoadingError';
import MutableProject from 'src/containers/MutableProject';
import QueriedIssueList from 'src/containers/QueriedIssueList';

interface Props {
    match: Match<RouteParams>;
}

export default ({ match }: Props) => (
    <React.Fragment>
        <Query query={getProject} variables={{ id: match.params.projectID }}>
            {({ loading, error, data }: QueryResult) => {
                if (loading) return <LoadingSpinner message="Loading project" />
                if (error) return <LoadingError error={error} />

                return (
                    <React.Fragment>
                        <NotPermittedRender requiredLevel={PermissionLevel.Read} resource={data.project}>
                            <Redirect to='/401' />
                        </NotPermittedRender>

                        <MutableProject project={data.project} />
                    </React.Fragment>
                )
            }}
        </Query>

        <QueriedIssueList match={match} emptyMsg='This project contains no issues. Create one using the controls above.' />
    </React.Fragment>
);
