import * as React from 'react';
import * as wait from 'waait';
import { cleanup, render } from 'react-testing-library';
import { MockedProvider } from 'react-apollo/test-utils';
import { userMock } from 'testUtil/mocks';
import { isAuthenticated } from 'src/util/graphql/clientQueries';
import { PermissionLevel } from 'src/types/Permissions';

import AuthorRender from './AuthorRender';

const authenticatedMock: any[] = [{
    request: { query: isAuthenticated },
    result: { data: { auth_authenticated: true } }
}];

const unauthenticatedMock: any[] = [{
    request: { query: isAuthenticated },
    result: { data: { auth_authenticated: false } }
}];

beforeEach(cleanup);

const TestComponent = (props: any) => (
    <h1>Test Component</h1>
);

test('No Render: User is unauthenticated', async () => {
    const mockResource: any = { };

    const { queryByText } = render(
        <MockedProvider mocks={unauthenticatedMock}>
            <AuthorRender resource={mockResource}>
                <TestComponent />
            </AuthorRender>
        </MockedProvider>
    );

    await wait(0);

    expect(queryByText('Test Component')).toBeNull();
});

test('Render: User is resource author', async () => {
    const mockPermission: Permission = {
        id: 'pm01',
        level: PermissionLevel.None, // we should render as author even though permission level is low
        userID: userMock.id,
        resourceID: 'i01'
    };

    const mockResource: any = {
        id: 'i01',
        creator: userMock,
        userPermissions: mockPermission
    };

    const { queryByText } = render(
        <MockedProvider mocks={authenticatedMock}>
            <AuthorRender resource={mockResource}>
                <TestComponent />
            </AuthorRender>
        </MockedProvider>
    );

    await wait(0);

    expect(queryByText('Test Component')).not.toBeNull();
});

test('No Render: User is not author', async () => {
    const mockPermission: Permission = {
        id: 'pm01',
        level: PermissionLevel.None, // we should render as author even though permission level is low
        userID: 'u02',               // different ID than resource creator
        resourceID: 'i01'
    };

    const mockResource: any = {
        id: 'i01',
        creator: userMock,
        userPermissions: mockPermission
    };

    const { queryByText } = render(
        <MockedProvider mocks={authenticatedMock}>
            <AuthorRender resource={mockResource}>
                <TestComponent />
            </AuthorRender>
        </MockedProvider>
    );

    await wait(0);

    expect(queryByText('Test Component')).toBeNull();
});
