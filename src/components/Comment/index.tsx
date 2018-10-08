import * as React from 'react';
import { HTMLAttributes } from 'react';

// styles
import './Comment.css'

import CommentSegments from './Segments'

interface Props extends HTMLAttributes<HTMLElement> {
    comment: Comment;
}

export default ({ comment }: Props) => (
    <CommentSegments comment={comment}>
        {({ Author, Body }: any) => (
            <div className='Comment'>
                <Author />
                <Body />
            </div>
        )}
    </CommentSegments>
);
