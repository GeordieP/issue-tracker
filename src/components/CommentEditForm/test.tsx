import * as React from 'react';
import { render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { commentMock, extraPropsMock } from 'testUtil/mocks';

// components
import CommentEditForm from './';

const spy = jest.fn();

const { getByText, getByTestId, container: { firstChild } } = render(
    <CommentEditForm comment={commentMock} onSubmit={spy} {...extraPropsMock} />
);

test('comment ID field is readonly, disabled, and hidden', () => {
    const commentIDField = getByTestId('editComment_commentID');

    ['readonly', 'hidden', 'disabled'].forEach(attr => {
        expect(commentIDField).toHaveAttribute(attr);
    });
});

test('clicking submit calls onSubmit prop', () => {
    expect(spy).toHaveBeenCalledTimes(0);
    fireEvent.submit(getByText('Save Comment'));
    expect(spy).toHaveBeenCalledTimes(1);
});

test('renders with additional props', () => {
    expect(firstChild).toHaveAttribute('title', extraPropsMock.title);
    expect(firstChild).toHaveClass(extraPropsMock.className);
});
