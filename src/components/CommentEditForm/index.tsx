import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';

import CommentEditSegments from './Segments';

interface Props extends HTMLAttributes<HTMLFormElement> {
    comment: Comment;
    onSubmit: FormEventHandler;
}

export default ({ comment, onSubmit }: Props) => (
    <CommentEditSegments comment={comment} onSubmit={onSubmit}>
        {({ BodyField, SubmitBtn }: any) => (
            <React.Fragment>
                <BodyField />
                <section className='u-alignRight'>
                    <SubmitBtn />
                </section>
            </React.Fragment>
        )}
    </CommentEditSegments>
);
