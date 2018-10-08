import * as React from 'react';
import { HTMLAttributes } from 'react';

// styles
import './Comment.css'

interface Props extends HTMLAttributes<HTMLElement> {
    comment: Comment;
    children: any;
}

export default ({ comment, children }: Props) => {
    const renderAuthor = () => (
        <div className='Comment-username'>{ comment.creator.username }</div>
    );

    const renderBody = () => (
        <pre className='Comment-body'>{ comment.body}</pre>
    );

    return children({
        Author: renderAuthor,
        Body: renderBody,
    });
}
