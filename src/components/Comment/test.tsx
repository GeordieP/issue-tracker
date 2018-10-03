import * as React from 'react';
import { render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { commentMock, extraPropsMock } from 'testUtil/mocks';

// components
import Comment from './';

const { getByText, container: { firstChild } } = render(
    <Comment comment={commentMock} {...extraPropsMock} />
);

test('renders comment username and body', () => {
    expect(getByText(commentMock.creator.username)).toBeVisible();
    expect(getByText(commentMock.body)).toBeVisible();
});

test('renders with additional props', () => {
    expect(firstChild).toHaveAttribute('title', extraPropsMock.title);
    expect(firstChild).toHaveClass(extraPropsMock.className);
});
