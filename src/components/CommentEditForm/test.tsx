import * as React from 'react';
import { render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { commentMock } from 'testUtil/mocks';

// components
import CommentEditSegments from './Segments';

describe('Comment edit form segments', () => {
    const spy = jest.fn();

    const { getByText, getByTestId } = render(
        <CommentEditSegments comment={commentMock} onSubmit={spy}>
            {({ Author, BodyField, SubmitBtn }: any) => (
                <React.Fragment>
                    <Author />
                    <BodyField />
                    <SubmitBtn />
                </React.Fragment>
            )}
        </CommentEditSegments>
    );

    test('All fields are rendered', () => {
        expect(getByText(commentMock.creator.username)).toBeVisible();
        expect(getByTestId('editComment_body')).toBeVisible();
        expect(getByTestId('editComment_submit')).toBeVisible();
    });

    test('comment ID field is readonly, disabled, and hidden', () => {
        const commentIDField = getByTestId('editComment_commentID');

        ['readonly', 'hidden', 'disabled'].forEach(attr => {
            expect(commentIDField).toHaveAttribute(attr);
        });
    });
});
