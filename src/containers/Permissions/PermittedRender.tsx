import { graphql } from 'react-apollo';

import { isAuthenticated } from 'src/util/graphql/clientQueries';
import { checkPermissions, checkUnauthPermissions } from 'src/util/permissions';
import { PermissionLevel } from 'src/types/Permissions';
import { ResourceType } from 'src/types/Resources';

interface Props {
    requiredLevel: PermissionLevel;
    resource: Resource;
    resourceType?: ResourceType;
    data?: any;
    children?: any;
}

interface Response {
    auth_authenticated: boolean;
}

// Render children only if signed in and permitted.
const PermittedRender = ({
    data: { loading, error, auth_authenticated },
    requiredLevel,
    resource,
    resourceType = ResourceType.Project,
    children
}: Props) => {
    if (loading) return null;
    if (error) {
        console.error(error);
        return null;
    }

    if (auth_authenticated) {
        // we're signed in;
        // check permissions for resource, render children if we're permitted.
        if (checkPermissions(requiredLevel, resource)) return children;
    } else {
        // not signed in;
        // check default permissions for resource type, render children if we're permitted.
        if (checkUnauthPermissions(requiredLevel, resourceType)) return children;
    }

    return null;
}

export default graphql<Props, Response>(isAuthenticated)(PermittedRender);
