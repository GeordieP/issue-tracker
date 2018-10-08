import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';
import * as classnames from 'classnames';

interface Props extends HTMLAttributes<HTMLFormElement> {
    comment: Comment;
    onSubmit: FormEventHandler;
    children: any;
}

export default ({ comment, onSubmit, className, children }: Props) => {
    const renderAuthor = () => (
        <div className='EditComment-username'>{ comment.creator.username }</div>
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
            className="Button Button--save circle"
            data-testid='editComment_submit'>
            S
        </button>
    );

    return (
        <form onSubmit={onSubmit} className={classnames('u-flexV', className)}>
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
                    BodyField: renderBodyField,
                    SubmitBtn: renderSubmitBtn,
                })
            }
        </form>
    );
}
