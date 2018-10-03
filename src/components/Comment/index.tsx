import * as React from 'react';
import { HTMLAttributes } from 'react';

// styles
import './Comment.css'

interface Props extends HTMLAttributes<HTMLElement> {
    comment: Comment;
    props?: any[];
}

export default ({ comment, ...props }: Props) => (
    <div {...props}>
        <div className="comment_creator_username">
            {comment.creator.username}
        </div>
        <pre className="Comment-body">
            {comment.body}
        </pre>
    </div>
);
