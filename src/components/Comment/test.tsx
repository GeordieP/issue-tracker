import * as React from 'react';
import { render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { commentMock } from 'testUtil/mocks';

// components
import CommentSegments from './Segments';

describe('Comment segments', () => {
    const { getByText } = render(
        <CommentSegments comment={commentMock}>
            {({ Author, Body }: any) => (
                <React.Fragment>
                    <Author />
                    <Body />
                </React.Fragment>
            )}
        </CommentSegments>
    );

    test('renders comment username and body', () => {
        expect(getByText(commentMock.creator.username)).toBeVisible();
        expect(getByText(commentMock.body)).toBeVisible();
    });
});
