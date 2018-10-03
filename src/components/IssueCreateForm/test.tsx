import * as React from 'react';
import { render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { projectMock, extraPropsMock } from 'testUtil/mocks';

// components
import IssueCreateForm from './';

const spy = jest.fn();

const { getByText, getByTestId, container: { firstChild } } = render(
    <IssueCreateForm
        projectID={projectMock.id}
        onSubmit={spy}
        {...extraPropsMock}
    />
);

test('parent project ID field is readonly, disabled, and hidden', () => {
    const projectIDField = getByTestId('createIssue_projectID');

    ['readonly', 'hidden', 'disabled'].forEach(attr => {
        expect(projectIDField).toHaveAttribute(attr);
    });
});

test('clicking submit calls onSubmit prop', () => {
    expect(spy).toHaveBeenCalledTimes(0);
    fireEvent.submit(getByText('Create Issue'));
    expect(spy).toHaveBeenCalledTimes(1);
});

test('renders with additional props', () => {
    expect(firstChild).toHaveAttribute('title', extraPropsMock.title);
    expect(firstChild).toHaveClass(extraPropsMock.className);
});
