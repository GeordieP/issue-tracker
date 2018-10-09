import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';
import * as classnames from 'classnames';
import { Save as SaveIcon } from 'react-feather';

import './CommentEditForm.css';

interface Props extends HTMLAttributes<HTMLFormElement> {
    comment: Comment;
    onSubmit: FormEventHandler;
    children: any;
}

export default ({ comment, onSubmit, className, children }: Props) => {
    const renderAuthor = () => (
        <div className='Comment-author'>{ comment.creator.username }</div>
    );

    const renderDate = () => (
        <div className='Comment-date'>{ new Date(comment.dateUpdated).toDateString() }</div>
    );

    const renderBodyField = () => (
        <textarea
            name="body"
            placeholder="Provide some details"
            data-testid='editComment_body'
            defaultValue={comment.body}
        />
    );

    const renderSubmitBtn = () => (
        <button
            type="submit"
            className="SmallButton SmallButton--save"
            data-testid='editComment_submit'>
            <SaveIcon />
        </button>
    );

    return (
        <form onSubmit={onSubmit} className={classnames('CommentEditForm u-flexV', className)}>
            <input
                type="text"
                name="id"
                data-testid='editComment_commentID'
                value={comment.id}
                readOnly={true} hidden={true} disabled={true}
            />

            {
                children({
                    Author: renderAuthor,
                    Date: renderDate,
                    BodyField: renderBodyField,
                    SubmitBtn: renderSubmitBtn,
                })
            }
        </form>
    );
}
