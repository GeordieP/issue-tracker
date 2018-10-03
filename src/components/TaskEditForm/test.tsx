import * as React from 'react';
import { render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { taskMock, extraPropsMock } from 'testUtil/mocks';

// components
import TaskEditForm from './';

const spy = jest.fn();

const { getByText, getByTestId, container: { firstChild } } = render(
    <TaskEditForm task={taskMock} onSubmit={spy} {...extraPropsMock} />
);

test('task ID field is readonly, disabled, and hidden', () => {
    const taskIDField = getByTestId('editTask_taskID');

    ['readonly', 'hidden', 'disabled'].forEach(attr => {
        expect(taskIDField).toHaveAttribute(attr);
    });
});

test('clicking submit calls onSubmit prop', () => {
    expect(spy).toHaveBeenCalledTimes(0);
    fireEvent.submit(getByText('Save Task'));
    expect(spy).toHaveBeenCalledTimes(1);
});

test('renders with additional props', () => {
    expect(firstChild).toHaveAttribute('title', extraPropsMock.title);
    expect(firstChild).toHaveClass(extraPropsMock.className);
});
