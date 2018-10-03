import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import { projectMock } from 'testUtil/mocks';

import ProjectList from './';
import ProjectListItem from './ProjectListItem';

beforeEach(cleanup);

describe('ProjectListItem', () => {
    test('renders project data', () => {
        const { getByText } = render(
            <MemoryRouter>
                <ProjectListItem project={projectMock} />
            </MemoryRouter>
        );

        expect(getByText(projectMock.name)).toBeVisible();
        expect(getByText(projectMock.creator.username)).toBeVisible();
        expect(getByText(projectMock.alias)).toBeVisible();
    });
});

describe('ProjectList', () => {
    // duplicate first project, but give each a unique ID
    const projectMocks = [
        projectMock,
        { ...projectMock, id: 'p02' },
        { ...projectMock, id: 'p03' },
    ];

    test('renders each project', () => {
        const { container } = render(
            <MemoryRouter>
                <ProjectList projects={projectMocks} />
            </MemoryRouter>
        );

        // renders correct number of children
        expect(container.children.length).toBe(projectMocks.length);
    });
});
