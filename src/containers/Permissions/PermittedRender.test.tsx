import * as React from 'react';
import * as wait from 'waait';
import { cleanup, render } from 'react-testing-library';
import { MockedProvider } from 'react-apollo/test-utils';
import { userMock } from 'testUtil/mocks';
import { isAuthenticated } from 'src/util/graphql/clientQueries';
import { PermissionLevel } from 'src/types/Permissions';
import { ResourceType } from 'src/types/Resources';

import PermittedRender from './PermittedRender';

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

test('No Render: User is unauthenticated, default resource level is below required', async () => {
    const mockResource: any = {
        id: 'i01',
        creator: 'u01', // creator id has to be different; creators always have permissions
        userPermissions: {} // user permissions won't matter, since we're relying on defaults
    };

    const { queryByText } = render(
        <MockedProvider mocks={unauthenticatedMock}>
            <PermittedRender
                requiredLevel={PermissionLevel.Edit}
                resource={mockResource}
                resourceType={ResourceType.Project}
            >
                <TestComponent />
            </PermittedRender>
        </MockedProvider>
    );

    await wait(0);

    expect(queryByText('Test Component')).toBeNull();
});

test('Render: User is above required level', async () => {
    const mockAdminPermission: Permission = {
        id: 'pm01',
        level: PermissionLevel.Admin,
        userID: userMock.id,
        resourceID: 'i01'
    };

    const mockResource: any = {
        id: 'i01',
        creator: 'u02', // creator id has to be different; creators always have permissions
        userPermissions: mockAdminPermission
    };

    const { queryByText } = render(
        <MockedProvider mocks={authenticatedMock}>
            <PermittedRender
                requiredLevel={PermissionLevel.Read}
                resource={mockResource}
                resourceType={ResourceType.Project}
            >
                <TestComponent />
            </PermittedRender>
        </MockedProvider>
    );

    await wait(0);

    expect(queryByText('Test Component')).not.toBeNull();
});

test('No Render: User permission level lower than required', async () => {
    const mockAdminPermission: Permission = {
        id: 'pm01',
        level: PermissionLevel.Read,
        userID: userMock.id,
        resourceID: 'i01'
    };

    const mockResource: any = {
        id: 'i01',
        creator: 'u02', // creator id has to be different; creators always have permissions
        userPermissions: mockAdminPermission
    };

    const { queryByText } = render(
        <MockedProvider mocks={authenticatedMock}>
            <PermittedRender
                requiredLevel={PermissionLevel.Create}
                resource={mockResource}
                resourceType={ResourceType.Project}
            >
                <TestComponent />
            </PermittedRender>
        </MockedProvider>
    );

    await wait(0);

    expect(queryByText('Test Component')).toBeNull();
});

test('Render: User permission level lower than required, but user is creator', async () => {
    const mockAdminPermission: Permission = {
        id: 'pm01',
        level: PermissionLevel.None,
        userID: userMock.id,
        resourceID: 'i01'
    };

    const mockResource: any = {
        id: 'i01',
        creator: userMock, // same id as the mock permissions object
        userPermissions: mockAdminPermission
    };

    const { queryByText } = render(
        <MockedProvider mocks={authenticatedMock}>
            <PermittedRender
                requiredLevel={PermissionLevel.Read}
                resource={mockResource}
                resourceType={ResourceType.Project}
            >
                <TestComponent />
            </PermittedRender>
        </MockedProvider>
    );

    await wait(0);

    expect(queryByText('Test Component')).not.toBeNull();
});
