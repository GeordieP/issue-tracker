import * as React from 'react';
import { render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { extraPropsMock } from 'testUtil/mocks';

import ProjectCreateForm from './';

const spy = jest.fn();

const { getByText, container: { firstChild } } = render(
    <ProjectCreateForm onSubmit={spy} {...extraPropsMock} />
);

test('clicking submit calls onSubmit prop', () => {
    expect(spy).toHaveBeenCalledTimes(0);
    fireEvent.submit(getByText('Save'));
    expect(spy).toHaveBeenCalledTimes(1);
});

test('renders with additional props', () => {
    expect(firstChild).toHaveAttribute('title', extraPropsMock.title);
    expect(firstChild).toHaveClass(extraPropsMock.className);
});
