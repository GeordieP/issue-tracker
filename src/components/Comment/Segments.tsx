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
        <div className='Comment-author'>{ comment.creator.username }</div>
    );

    const renderDate = () => (
        <div className='Comment-date'>{ new Date(comment.dateUpdated).toDateString() }</div>
    );

    const renderBody = () => (
        <pre className='Comment-body'>{ comment.body}</pre>
    );

    return (
        <div className='Comment'>
            {
                children({
                    Author: renderAuthor,
                    Date: renderDate,
                    Body: renderBody,
                })
            }
        </div>
    );
}
