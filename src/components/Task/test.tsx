import * as React from 'react';
import { render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { taskMock, extraPropsMock } from 'testUtil/mocks';

// components
import Task from './';
import TaskSegments from './Segments';

describe('Task Segments', () => {
    const { getByText, getByLabelText } = render(
        <TaskSegments task={taskMock}>
            {({ Title, Body, Status }: any) => (
                <React.Fragment>
                    <Title />
                    <Status />
                    <Body />
                </React.Fragment>
            )}
        </TaskSegments>
    );

    test('renders task data', () => {
        expect(getByText(taskMock.title)).toBeVisible();
        expect(getByText(taskMock.body)).toBeVisible();
        expect(getByLabelText('Open', { selector: 'input' })).toBeVisible();
    });
});

describe('Task', () => {
    const { getByText, getByLabelText, container: { firstChild } } = render(
        <Task task={taskMock} {...extraPropsMock} />
    );

    test('renders task data', () => {
        expect(getByText(taskMock.title)).toBeVisible();
        expect(getByText(taskMock.body)).toBeVisible();
        expect(getByLabelText('Open', { selector: 'input' })).toBeVisible();
    });

    test('renders with additional props', () => {
        expect(firstChild).toHaveAttribute('title');
        expect(firstChild).toHaveClass(extraPropsMock.className);
    });
});
