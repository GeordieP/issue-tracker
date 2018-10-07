import * as React from 'react';
import { render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { issueMock, extraPropsMock } from 'testUtil/mocks';

// components
import Issue from './';
import IssueSegments from './Segments';


describe('Issue Segments', () => {
    const { getByText, getByTestId } = render(
        <IssueSegments issue={issueMock}>
            {({ Title, Body, Details }: { Title: any, Body: any, Details: any }) => (
                <React.Fragment>
                    <Title />
                    <Body />
                    <Details />
                </React.Fragment>
            )}
        </IssueSegments>
    );

    test('renders issue data', () => {
        const contains = { exact: false };

        expect(getByText(issueMock.title)).toBeVisible();
        expect(getByText(issueMock.creator.username, contains)).toBeVisible();
        expect(getByText(issueMock.type, contains)).toBeVisible();
        expect(getByText(issueMock.status, contains)).toBeVisible();
        expect(getByText(issueMock.severity, contains)).toBeVisible();
        expect(getByTestId('issue_date')).toBeVisible();
        expect(getByText(issueMock.body)).toBeVisible();
    });
});

describe('Issue', () => {
    const { getByText, getByTestId, container: { firstChild } } = render(
        <Issue issue={issueMock} {...extraPropsMock} />
    );

    test('renders issue data', () => {
        const contains = { exact: false };

        expect(getByText(issueMock.title)).toBeVisible();
        expect(getByText(issueMock.creator.username, contains)).toBeVisible();
        expect(getByText(issueMock.type, contains)).toBeVisible();
        expect(getByText(issueMock.status, contains)).toBeVisible();
        expect(getByText(issueMock.severity, contains)).toBeVisible();
        expect(getByTestId('issue_date')).toBeVisible();
        expect(getByText(issueMock.body)).toBeVisible();
    });

    test('renders with additional props', () => {
        expect(firstChild).toHaveAttribute('title', extraPropsMock.title);
        expect(firstChild).toHaveClass(extraPropsMock.className);
    });
});
