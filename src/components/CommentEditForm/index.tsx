import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';

import CommentEditSegments from './Segments';

interface Props extends HTMLAttributes<HTMLFormElement> {
    comment: Comment;
    onSubmit: FormEventHandler;
}

export default ({ comment, onSubmit }: Props) => (
    <CommentEditSegments comment={comment} onSubmit={onSubmit}>
        {({ Author, BodyField, SubmitBtn }: any) => (
            <React.Fragment>
                <div className='u-flexH'>
                    <Author />
                    <SubmitBtn />
                </div>
                <BodyField />
            </React.Fragment>
        )}
    </CommentEditSegments>
);
