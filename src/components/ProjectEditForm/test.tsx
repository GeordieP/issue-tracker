import * as React from 'react';
import { render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { projectMock, extraPropsMock } from 'testUtil/mocks';

// components
import ProjectEditForm from './';

const spy = jest.fn();

const { getByText, getByTestId, container: { firstChild } } = render(
    <ProjectEditForm project={projectMock} onSubmit={spy} {...extraPropsMock} />
);

test('project ID field is readonly, disabled, and hidden', () => {
    const projectIDField = getByTestId('editProject_projectID');

    ['readonly', 'hidden', 'disabled'].forEach(attr => {
        expect(projectIDField).toHaveAttribute(attr);
    });
});

test('clicking submit calls onSubmit prop', () => {
    expect(spy).toHaveBeenCalledTimes(0);
    fireEvent.submit(getByText('Save'));
    expect(spy).toHaveBeenCalledTimes(1);
});

test('renders with additional props', () => {
    expect(firstChild).toHaveAttribute('title', extraPropsMock.title);
    expect(firstChild).toHaveClass(extraPropsMock.className);
});
