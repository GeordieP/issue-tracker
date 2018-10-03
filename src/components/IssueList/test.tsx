import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import { issueMock } from 'testUtil/mocks';

import IssueList from './';
import IssueListItem from './IssueListItem';

beforeEach(cleanup);

describe('IssueListItem', () => {
    test('renders issue data', () => {
        const contains = { exact: false };
        const { getByText, getByTestId } = render(
            <IssueListItem issue={issueMock} />
        );

        expect(getByText(issueMock.title)).toBeVisible();
        expect(getByText(issueMock.creator.username)).toBeVisible();
        expect(getByText(issueMock.type, contains)).toBeVisible();
        expect(getByText(issueMock.status, contains)).toBeVisible();
        expect(getByText(issueMock.severity, contains)).toBeVisible();
        expect(getByTestId('issueListItem_date')).toBeVisible();
    });
});

describe('IssueList', () => {
    // duplicate first issue, but give each a unique ID
    const issueMocks = [
        issueMock,
        { ...issueMock, id: 'i02' },
        { ...issueMock, id: 'i03' },
    ];

    test('renders each issue', () => {
        const { container } = render(
            <MemoryRouter>
                <IssueList issues={issueMocks} />
            </MemoryRouter>
        );

        // renders correct number of children
        expect(container.children.length).toBe(issueMocks.length);
    });
});
