import * as React from 'react';
import { FormEvent, FormEventHandler } from 'react';
import { ApolloConsumer } from 'react-apollo';
import history from 'src/util/history';
import { submitFormLogin } from 'src/util/formSubmission';

import LoginForm from 'src/components/LoginForm';

// bind the apollo client to a form event handler, for use in login form onSubmit handler.
// when we log in, we want to directly update the apollo cache.
const loginWithClient = (client: any): FormEventHandler => async (e: FormEvent) => {
    try {
        const res = await submitFormLogin(e);
        // clear any existing user data/permissions from the cache
        client.cache.reset();

        if (res.status !== 200) {
            console.error('Login failed.', res.data);
            client.writeData({ data: { auth_authenticated: false }})
            return;
        }

        // update the apollo cache auth_authenticated property, and append
        // all other authentication-related properties from the server. These can include the
        // authenticated user's username, their user ID, and their site-wide permission level.
        client.writeData({ data: {
            auth_authenticated: true,
            ...res.data
        }});

        // we're done logging in, redirect to the home page.
        history.push('/');
    } catch(e) {
        console.error(e);
    }
}

export default () => (
    <ApolloConsumer>
        { (client: any) => (
            <React.Fragment>
                <h1>Login</h1>
                <LoginForm onSubmit={loginWithClient(client)} />
            </React.Fragment>
        )}
    </ApolloConsumer>
);
