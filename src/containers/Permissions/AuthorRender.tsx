import { graphql } from 'react-apollo';

import { checkIsAuthor } from 'src/util/permissions';
import { isAuthenticated } from 'src/util/graphql/clientQueries';

interface Props {
    resource: Resource;
    data?: any;
    children?: any;
}

interface Response {
    auth_authenticated: boolean;
}

const AuthorRender = ({
    data: { loading, error, auth_authenticated },
    resource,
    children
}: Props): any => {
    if (loading) return null;
    if (error) {
        console.error(error);
        return null;
    }

    // we're not signed in, don't render.
    if (!auth_authenticated) return null;

    // if we're the author, render children.
    if (checkIsAuthor(resource)) return children;

    return null;
}

export default graphql<Props, Response>(isAuthenticated)(AuthorRender);
