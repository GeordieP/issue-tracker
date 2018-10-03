import * as React from 'react';
import { render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { issueMock, extraPropsMock } from 'testUtil/mocks';

// types
import { CommentParentType } from 'src/types/Comments';

// components
import CommentCreateForm from './';

const spy = jest.fn();

const { getByText, getByTestId, container: { firstChild } } = render(
    <CommentCreateForm
        parentID={issueMock.id}
        parentType={CommentParentType.ISSUE}
        onSubmit={spy}
        {...extraPropsMock}
    />
);

test('parentID and parentType fields are readonly, disabled, and hidden', () => {
    const parentIDField = getByTestId('createComment_parent');
    const parentTypeField = getByTestId('createComment_parentType');

    ['readonly', 'hidden', 'disabled'].forEach(attr => {
        expect(parentIDField).toHaveAttribute(attr);
        expect(parentTypeField).toHaveAttribute(attr);
    });
});

test('clicking submit calls onSubmit prop', () => {
    expect(spy).toHaveBeenCalledTimes(0);
    fireEvent.submit(getByText('Submit Comment'));
    expect(spy).toHaveBeenCalledTimes(1);
});

test('renders with additional props', () => {
    expect(firstChild).toHaveAttribute('title', extraPropsMock.title);
    expect(firstChild).toHaveClass(extraPropsMock.className);
});
