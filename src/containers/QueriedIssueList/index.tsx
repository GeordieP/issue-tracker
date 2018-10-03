import * as React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { match as Match } from 'react-router-dom';
import { getIssuesForProject } from 'src/util/graphql/queries';

// components
import LoadingSpinner from 'src/components/LoadingSpinner';
import LoadingError from 'src/components/LoadingError';
import IssueList from 'src/components/IssueList';

interface Props {
    match?: Match<RouteParams>;
    emptyMsg?: string; // optional message to display when list is empty
    parentID?: ID;
}

export default ({ match, emptyMsg, parentID }: Props) => {
    if (!match && !parentID) {
        throw new Error('One of the following props must be passed - parentID: string, match: object');
    }

    let project: ID;

    if (parentID) {
        project = parentID;
    } else if (match && match.params.projectID) {
        project = match.params.projectID;
    } else {
        return null; // this should never be reached, but makes the TSLS be quiet.
    }

    let linkBaseUrl: string;

    if (match) {
        linkBaseUrl = match.url.replace(/\/?issues.+/g, '');
    } else {
        linkBaseUrl = '';
    }

    return (
        <Query query={getIssuesForProject} variables={{ project }}>
            {({ loading, error, data }: QueryResult) => {
                if (loading) return <LoadingSpinner message="Loading issues" />
                if (error) return <LoadingError error={error} />

                if (data.issues.length === 0) {
                    if (emptyMsg) return (
                        <h3>{emptyMsg}</h3>
                    );

                    return null;
                }

                return (
                    <IssueList
                        issues={data.issues}
                        linkBaseUrl={linkBaseUrl}
                        match={match}
                    />
                )
            }}
        </Query>
    );
}
