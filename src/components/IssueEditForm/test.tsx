import * as React from 'react';
import { render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { issueMock, extraPropsMock } from 'testUtil/mocks';

// components
import IssueEditForm from './';

const spy = jest.fn();

const { getByText, getByTestId, container: { firstChild } } = render(
    <IssueEditForm issue={issueMock} onSubmit={spy} {...extraPropsMock} />
);

test('issue ID field is readonly, disabled, and hidden', () => {
    const issueIDField = getByTestId('editIssue_issueID');

    ['readonly', 'hidden', 'disabled'].forEach(attr => {
        expect(issueIDField).toHaveAttribute(attr);
    });
});

test('clicking submit calls onSubmit prop', () => {
    expect(spy).toHaveBeenCalledTimes(0);
    fireEvent.submit(getByText('Save Issue'));
    expect(spy).toHaveBeenCalledTimes(1);
});

test('renders with additional props', () => {
    expect(firstChild).toHaveAttribute('title', extraPropsMock.title);
    expect(firstChild).toHaveClass(extraPropsMock.className);
});
