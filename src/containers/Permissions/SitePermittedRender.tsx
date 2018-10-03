import { graphql } from 'react-apollo';

import { checkSiteDefaultPermissions, checkSiteUnauthPermissions } from 'src/util/permissions';
import { authStatus } from 'src/util/graphql/clientQueries';
import { PermissionLevel } from 'src/types/Permissions';

interface Props {
    requiredLevel: PermissionLevel;
    data?: any;
    children?: any;
}

interface Response {
    auth_authenticated: boolean;
}

// Render children only if signed in and permitted.
const PermittedRender = ({
    data: { loading, error, auth_authenticated, auth_sitePermLevel },
    requiredLevel,
    children
}: Props) => {
    if (loading) return null;
    if (error) {
        console.error(error);
        return null;
    }


    if (auth_authenticated) {
        // we're signed in, check if we have access to site permission level on the user
        if (auth_sitePermLevel !== null && auth_sitePermLevel !== undefined) {
            if (auth_sitePermLevel >= requiredLevel) return children;
        }

        // user has no site permission level, check against default for authenticated users.
        if (checkSiteDefaultPermissions(requiredLevel)) return children;
    } else {
        // not signed in, check against unauthenticated defaults.
        if (checkSiteUnauthPermissions(requiredLevel)) return children;
    }

    return null;
}

export default graphql<Props, Response>(authStatus)(PermittedRender);
