import * as React from 'react';
import { Query, Mutation } from 'react-apollo';
import { Redirect, match as Match } from 'react-router-dom';
import { getProject, getIssuesForProject } from 'src/util/graphql/queries';
import { createIssue } from 'src/util/graphql/mutations';
import history from 'src/util/history';
import { submitFormMutation } from 'src/util/formSubmission';
import { PermissionLevel } from 'src/types/Permissions';

// components
import NotPermittedRender from 'src/containers/Permissions/NotPermittedRender';
import PermittedRender from 'src/containers/Permissions/PermittedRender';
import IssueCreateForm from 'src/components/IssueCreateForm';
import LoadingError from 'src/components/LoadingError';
import LoadingSpinner from 'src/components/LoadingSpinner';

interface Props {
    match: Match<RouteParams>;
}

interface OnCompletedArgs {
    createIssue: { id: ID };
}

// redirect to issue details page when issue creation is finished
const onCompletedFn = (match: Match<RouteParams>) => ({ createIssue: { id: newID } }: OnCompletedArgs) => {
    history.push(match.url.replace(/\/newIssue\/?/g, `/issues/${newID}`));
}

const IssueCreateView = ({ match }: Props) => (
    <Mutation
        mutation={createIssue}
        refetchQueries={[{ query: getIssuesForProject, variables: { project: match.params.projectID } }]}
        onCompleted={onCompletedFn(match)}
    >
        {(mutFn: any, { loading, error }: any) => {
            if (loading) return <LoadingSpinner />
            if (error) return <LoadingError error={error} />

            return (
                <IssueCreateForm
                    projectID={match.params.projectID}
                    onSubmit={submitFormMutation(mutFn)}
                />
            )
        }}
    </Mutation>
);

// ensure user has permission to view page
export default ({ match }: Props) => (
    <Query query={getProject} variables={{ project: match.params.projectID }}>
        {({ loading, error, data }: any) => {
            if (loading) return 'Loading';
            if (error) {
                console.log(error);
                return error.message;
            }

            return (
                <React.Fragment>
                    {/* if we're not permitted to use this page, redirect. */}
                    <NotPermittedRender resource={data.project} requiredLevel={PermissionLevel.Create}>
                        <Redirect to='/401' />
                    </NotPermittedRender>

                    {/* if we're permitted, render the create view. */}
                    <PermittedRender resource={data.project} requiredLevel={PermissionLevel.Create}>
                        <h1>New Issue</h1>
                        <IssueCreateView match={match} />
                    </PermittedRender>
                </React.Fragment>
            );
        }}
    </Query>
)
