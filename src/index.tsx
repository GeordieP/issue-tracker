import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { onError } from 'apollo-link-error';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import { Router } from 'react-router-dom';
import axios from 'axios';
import history from 'src/util/history';

import registerServiceWorker from './util/registerServiceWorker';

import 'reset.css';
import 'system-font-css';
import 'src/styles/index.css';

import LayoutRoutes from 'src/LayoutRoutes'

const cache = new InMemoryCache();

const defaults = {
    auth_authenticated: false,
    auth_username: '',
    auth_id: '',
    auth_sitePermLevel: '',
}

const resolvers = {
    // none for now... can set all properties that are currently necessary directly.
    // if we need to support nesting, or validation of data,
    // we'll use a resolver.
}

const stateLink = withClientState({
    cache, defaults, resolvers
});

const errorLink = onError(({ graphQLErrors, networkError }: any) => {
    if (graphQLErrors != null) {
        graphQLErrors.forEach(({ stack }: any) => console.error(stack))
        /* graphQLErrors.map(({ message, locations, path }) => */
        /*     /1* console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`) *1/ */
        /*     console.error(error); */
        /* ); */
        }

    if (networkError != null) {
        console.log(`[Network Error]: ${networkError}`);
    }
});

// NOTE: this works, but throws an error when we cancel - not sure what to return in a failure case.
// const confirmLink = new ApolloLink((operation, forward) => {
//     console.log(`starting operation ${operation.operationName}`)
//     if (operation.operationName === 'DeleteProject') {
//         const sure = window.confirm("Are you sure you want to delete this project? All associated issues will also be deleted!");
//         if (!sure) return
//     }

//     return forward(operation)
// });

const client = new ApolloClient({
    cache,
    link: ApolloLink.from([
        // confirmLink,
        stateLink,
        errorLink,
        new HttpLink({
            uri: '/graphql',
            credentials: 'same-origin'
        }),
    ])
});

// this returns an unsubscribe function, but we don't use it for anything.
// const unsubscribe = client.onResetStore(stateLink.writeDefaults);
client.onResetStore(stateLink.writeDefaults as () => Promise<any>);

ReactDOM.render(
    <ApolloProvider client={client}>
        <Router history={history}>
            <LayoutRoutes />
        </Router>
    </ApolloProvider>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();

// app startup; get initial logged in status, and store the result in our apollo cache.
// this may include the user's username, user ID, and their site-wide permission level.
axios('/auth/status')
    .then(res => {
        // docs say to call writeData on the cache, but that seems to be buggy and often not work...
        // calling it on client appears to work properly, but is less documented (if at all?)
        client.writeData({ data: res.data });
    })
    .catch(console.error)
