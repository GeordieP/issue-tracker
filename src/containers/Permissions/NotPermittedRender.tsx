import { graphql } from 'react-apollo';

import { checkPermissions, checkUnauthPermissions } from 'src/util/permissions';
import { PermissionLevel } from 'src/types/Permissions';
import { isAuthenticated } from 'src/util/graphql/clientQueries';
import { ResourceType } from 'src/types/Resources';

interface Props {
    requiredLevel: PermissionLevel;
    resource: Resource;
    resourceType?: ResourceType,
    data?: any;
    children?: any;
}

interface Response {
    auth_authenticated: boolean;
}

// Only render children if the current user is LOWER THAN the required level.
// Useful for rendering redirects, not authorized messages, etc.
const NotPermittedRender = ({
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
        // check permissions for resource, render nothing if we're permitted.
        if (checkPermissions(requiredLevel, resource)) return null;
    } else {
        // we're not signed in;
        // check default permissions for resource type, render nothing if we're permitted.
        if (checkUnauthPermissions(requiredLevel, resourceType)) return null;
    }

    // we're past all checks, render children.
    return children;
}

export default graphql<Props, Response>(isAuthenticated)(NotPermittedRender);
