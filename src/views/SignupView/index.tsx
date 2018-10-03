import * as React from 'react';
import { FormEvent, FormEventHandler } from 'react';
import { ApolloConsumer } from 'react-apollo';
import history from 'src/util/history';
import { submitFormSignup } from 'src/util/formSubmission';

// components
import SignupForm from 'src/components/SignupForm';

const signupWithClient = (client: any): FormEventHandler => async (e: FormEvent) => {
    try {
        const res = await submitFormSignup(e);

        // clear any existing user data/permissions from the cache
        client.cache.reset();

        if (res.status !== 200) {
            console.error('Signup failed', res.data);
            client.writeData({ data: { auth_authenticated: false }});
            return;
        }

        // update the apollo cache auth_authenticated property, and append
        // all other authentication-related properties from the server. These can include the
        // authenticated user's username, their user ID, and their site-wide permission level.
        client.writeData({ data: {
            auth_authenticated: true,
            ...res.data
        }});

        // we're done signup, redirect to home page.
        history.push('/');
    } catch(e) {
        console.error(e);
    }
}

export default () => (
    <ApolloConsumer>
        { (client: any) => (
            <React.Fragment>
                <h1>Sign Up</h1>
                <SignupForm onSubmit={signupWithClient(client)} />
            </React.Fragment>
        )}
    </ApolloConsumer>
);
