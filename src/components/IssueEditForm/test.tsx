import * as React from 'react';
import { render, fireEvent } from 'react-testing-library';
import * as wait from 'waait';
import 'jest-dom/extend-expect';
import { issueMock, extraPropsMock } from 'testUtil/mocks';

// components
import IssueEditForm from './';
import IssueEditSegments from './Segments';

describe('Issue Edit Form Segments', () => {
    const spy = jest.fn();

    const { getByTestId } = render(
        <IssueEditSegments issue={issueMock} {...extraPropsMock} onSubmit={spy}>
            {({ TitleField, BodyField, SeverityField, TypeField, StatusField, SubmitBtn }: any) => (
                <React.Fragment>
                    <SubmitBtn />
                    <TitleField />
                    <BodyField />
                    <SeverityField />
                    <TypeField />
                    <StatusField />
                </React.Fragment>
            )}
        </IssueEditSegments>
    );

    // verify each piece is rendered
    test('All fields are rendered', () => {
        expect(getByTestId('editIssue_title')).toBeVisible();
        expect(getByTestId('editIssue_body')).toBeVisible();
        expect(getByTestId('editIssue_type')).toBeVisible();
        expect(getByTestId('editIssue_status')).toBeVisible();
        expect(getByTestId('editIssue_severity')).toBeVisible();
        expect(getByTestId('editIssue_submit')).toBeVisible();
    });
});

describe('Issue Edit Form', async () => {
    const spy = jest.fn();

    const { getByTestId } = render(
        <IssueEditForm issue={issueMock} onSubmit={spy} {...extraPropsMock} />
    );

    await wait(0);

    test('issue ID field is readonly, disabled, and hidden', () => {
        const issueIDField = getByTestId('editIssue_issueID');

        ['readonly', 'hidden', 'disabled'].forEach(attr => {
            expect(issueIDField).toHaveAttribute(attr);
        });
    });

    test('clicking submit calls onSubmit prop', () => {
        expect(spy).toHaveBeenCalledTimes(0);
        fireEvent.click(getByTestId('editIssue_submit'));
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
