import * as React from 'react';
import { render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { projectMock, extraPropsMock } from 'testUtil/mocks';

// components
import Project from './';

const { getByText, container: { firstChild } } = render(
    <Project project={projectMock} {...extraPropsMock} />
);

test('renders project data', () => {
    expect(getByText(projectMock.name)).toBeVisible();
    expect(getByText(projectMock.alias)).toBeVisible();
    expect(getByText(projectMock.creator.username)).toBeVisible();
});

test('renders with additional props', () => {
    expect(firstChild).toHaveAttribute('title', extraPropsMock.title);
    expect(firstChild).toHaveClass(extraPropsMock.className);
});
