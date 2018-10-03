import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import { taskMock } from 'testUtil/mocks';

import TaskListItem from './TaskListItem';

beforeEach(cleanup);

describe('TaskListItem', () => {
    test('renders task data', () => {
        const contains = { exact: false };
        const { getByText } = render(
            <MemoryRouter>
                <TaskListItem task={taskMock} />
            </MemoryRouter>
        );

        // currently, we only show title
        expect(getByText(taskMock.title, contains)).toBeVisible();
    });

    test('renders link if linkBaseUrl is provided', () => {
        const { getByTestId } = render(
            <MemoryRouter>
                <TaskListItem
                    task={taskMock}
                    linkBaseUrl='/projects/p01/issues/i01'
                />
            </MemoryRouter>
        );

        expect(getByTestId('taskListItem_titleLink')).toBeVisible();
    });

    test('doesn\'t render a link if linkBaseUrl is not provided', () => {
        const { queryByTestId } = render(
            <MemoryRouter>
                <TaskListItem task={taskMock} />
            </MemoryRouter>
        );

        expect(queryByTestId('taskListItem_titleLink')).toBeNull();
    });
});
