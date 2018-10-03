import * as React from 'react';
import { Mutation } from 'react-apollo' ;
import { Redirect, match as Match } from 'react-router-dom';
import { getProjects } from 'src/util/graphql/queries';
import { createProject } from 'src/util/graphql/mutations';
import history from 'src/util/history';
import { submitFormMutation } from 'src/util/formSubmission';
import { PermissionLevel } from 'src/types/Permissions';

// components
import SitePermittedRender from 'src/containers/Permissions/SitePermittedRender';
import SiteNotPermittedRender from 'src/containers/Permissions/SiteNotPermittedRender';
import ProjectCreateForm from 'src/components/ProjectCreateForm';
import LoadingError from 'src/components/LoadingError';
import LoadingSpinner from 'src/components/LoadingSpinner';

interface Props {
    match: Match<RouteParams>;
}

interface OnCompletedArgs {
    createProject: { id: ID };
}

const onCompletedFn = (match: Match<RouteParams>) => ({ createProject: { id: newID } }: OnCompletedArgs) => {
    history.push(match.url.replace(/\/newProject\/?/g, `/projects/${newID}`));
}

const ProjectCreateView = ({ match }: Props) => (
    <React.Fragment>
        <h1>New Project</h1>

        <Mutation
            mutation={createProject}
            refetchQueries={[{ query: getProjects }]}
            onCompleted={onCompletedFn(match)}
        >
            {(mutFn: any, { loading, error, refetch }: any) => {
                if (loading) return <LoadingSpinner />
                if (error) return <LoadingError error={error} />
                return <ProjectCreateForm onSubmit={submitFormMutation(mutFn)} />
            }}
        </Mutation>
    </React.Fragment>
);

// ensure the user has permission to view the page
export default (props: Props) => (
    <React.Fragment>
        {/* if we're not permitted to use this page, redirect. */}
        <SiteNotPermittedRender requiredLevel={PermissionLevel.Create}>
            <Redirect to='/401' />
        </SiteNotPermittedRender>

        {/* if we're permitted, render the create view. */}
        <SitePermittedRender requiredLevel={PermissionLevel.Create}>
            <ProjectCreateView {...props} />
        </SitePermittedRender>
    </React.Fragment>
);
