import * as React from 'react';
import { render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { taskMock, extraPropsMock } from 'testUtil/mocks';

// components
import Task from './';

const { getByText, getByLabelText, container: { firstChild } } = render(
    <Task task={taskMock} {...extraPropsMock} />
);

test('renders task data', () => {
    expect(getByText(taskMock.title)).toBeVisible();
    expect(getByText(taskMock.body)).toBeVisible();
    expect(getByLabelText('Open', { selector: 'input' })).toBeVisible();
});

test('renders with additional props', () => {
    expect(firstChild).toHaveAttribute('title');
    expect(firstChild).toHaveClass(extraPropsMock.className);
});
