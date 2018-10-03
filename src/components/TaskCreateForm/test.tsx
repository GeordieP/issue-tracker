import * as React from 'react';
import { render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { issueMock, extraPropsMock } from 'testUtil/mocks';

// components
import TaskCreateForm from './';

const spy = jest.fn();

const { getByText, getByTestId, container: { firstChild } } = render(
    <TaskCreateForm
        parentID={issueMock.id}
        onSubmit={spy}
        {...extraPropsMock}
    />
);

test('parent ID field is readonly, disabled, and hidden', () => {
    const parentIDField = getByTestId('createTask_parentID');

    ['readonly', 'hidden', 'disabled'].forEach(attr => {
        expect(parentIDField).toHaveAttribute(attr);
    });
});

test('clicking submit calls onSubmit prop', () => {
    expect(spy).toHaveBeenCalledTimes(0);
    fireEvent.submit(getByText('Create Task'));
    expect(spy).toHaveBeenCalledTimes(1);
});

test('renders with additional props', () => {
    expect(firstChild).toHaveAttribute('title', extraPropsMock.title);
    expect(firstChild).toHaveClass(extraPropsMock.className);
});
