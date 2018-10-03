import * as React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { getProjects } from 'src/util/graphql/queries';

// types
import { PermissionLevel } from 'src/types/Permissions';

// components
import SitePermittedRender from 'src/containers/Permissions/SitePermittedRender';
import SiteNotPermittedRender from 'src/containers/Permissions/SiteNotPermittedRender';
import LoadingSpinner from 'src/components/LoadingSpinner';
import LoadingError from 'src/components/LoadingError';
import ProjectList from 'src/components/ProjectList';

export default () => (
    <Query query={getProjects}>
        {({ loading, error, data }: QueryResult) => {
            if (loading) return <LoadingSpinner message="Loading projects" />
            if (error) return <LoadingError error={error} />

            return (
                <React.Fragment>
                    <SiteNotPermittedRender requiredLevel={PermissionLevel.Read}>
                        <p>You are not authorized to view the project list.</p>
                    </SiteNotPermittedRender>

                    <SitePermittedRender requiredLevel={PermissionLevel.Read}>
                        <ProjectList projects={data.projects} />
                    </SitePermittedRender>
                </React.Fragment>
            );
        }}
    </Query>
);
