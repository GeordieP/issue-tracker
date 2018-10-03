import * as React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { match as Match } from 'react-router-dom';
import { getIssuesForProject } from 'src/util/graphql/queries';

interface Props {
    match: Match<RouteParams>;
}

// Get issues list, and render a Redirect component pointing to the first one.
// This is so we can redirect a split view to a route where something is displayed
// in the content slot, rather than nothing for the content slot matching the
// current URL.

export default ({ match }: Props) => (
    <Query query={getIssuesForProject} variables={{ project: match.params.projectID }}>
        {({ loading, error, data }: QueryResult) => {
            if (loading) return 'Page Loading...'
            if (error) {
                console.error(error);
                return 'Redirect error.'
            }

            // if the project contains no issues, we can't redirect to its first issue,
            // so redirect to the project details page instead.
            const to = (data.issues.length === 0)
                ? `/projectDetails/${match.params.projectID}`
                : `/projects/${match.params.projectID}/issues/${data.issues[0].id}`;

            return <Redirect to={to} />
        }}
    </Query>
);
