import * as React from 'react';
import { render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { userMock, extraPropsMock } from 'testUtil/mocks';

// components
import UserEditForm from './';

const spy = jest.fn();

const { getByText, getByTestId, container: { firstChild } } = render(
    <UserEditForm user={userMock} onSubmit={spy} {...extraPropsMock} />
);

test('user ID field is readonly, disabled, and hidden', () => {
    const userIDField = getByTestId('editUser_userID');

    ['readonly', 'hidden', 'disabled'].forEach(attr => {
        expect(userIDField).toHaveAttribute(attr);
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
