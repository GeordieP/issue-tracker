import * as React from 'react';
import * as wait from 'waait';
import { cleanup, render } from 'react-testing-library';
import { MockedProvider } from 'react-apollo/test-utils';
import { authStatus } from 'src/util/graphql/clientQueries';
import { PermissionLevel } from 'src/types/Permissions';

import SitePermittedRender from './SitePermittedRender';

// apollo mock: user is unauthenticated, default site permission level is Read
const unauthenticatedMock: any[] = [{
    request: { query: authStatus },
    result: { data: {
        auth_authenticated: false,
        auth_username: 'u01',
        auth_sitePermLevel: PermissionLevel.Read
    } }
}];

// function to create an apollo mock for authenticated user with given site permission level
const createAuthenticatedMock = (siteLevel: PermissionLevel): any[] => [{
    request: { query: authStatus },
    result: { data: {
        auth_authenticated: true,
        auth_username: 'u01',
        auth_sitePermLevel: siteLevel
    } }
}];

const TestComponent = (props: any) => (
    <h1>Test Component</h1>
);

beforeEach(cleanup);

test('No Render: User is unauthenticated, default site level is below required', async () => {
    const { queryByText } = render(
        <MockedProvider mocks={unauthenticatedMock}>
            <SitePermittedRender requiredLevel={PermissionLevel.Edit}>
                <TestComponent />
            </SitePermittedRender>
        </MockedProvider>
    );

    await wait(0);

    expect(queryByText('Test Component')).toBeNull();
});

test('Render: User is above required site level', async () => {
    const authenticatedMock = createAuthenticatedMock(PermissionLevel.Create);

    const { queryByText } = render(
        <MockedProvider mocks={authenticatedMock}>
            <SitePermittedRender requiredLevel={PermissionLevel.Read}>
                <TestComponent />
            </SitePermittedRender>
        </MockedProvider>
    );

    await wait(0);

    expect(queryByText('Test Component')).not.toBeNull();
});

test('No Render: User site permission level lower than required', async () => {
    const authenticatedMock = createAuthenticatedMock(PermissionLevel.Read);

    const { queryByText } = render(
        <MockedProvider mocks={authenticatedMock}>
            <SitePermittedRender requiredLevel={PermissionLevel.Create}>
                <TestComponent />
            </SitePermittedRender>
        </MockedProvider>
    );

    await wait(0);

    expect(queryByText('Test Component')).toBeNull();
});
