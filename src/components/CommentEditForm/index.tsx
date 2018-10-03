import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';
import * as classnames from 'classnames';

interface Props extends HTMLAttributes<HTMLFormElement> {
    comment: Comment;
    onSubmit: FormEventHandler;
    props?: any[];
}

export default ({ comment, onSubmit, className, ...props }: Props) => (
    <form onSubmit={onSubmit} className={classnames('u-flexV', className)} {...props}>
        <input
            type="text"
            name="id"
            data-testid='editComment_commentID'
            value={comment.id}
            readOnly={true} hidden={true} disabled={true}
        />

        <textarea
            name="body"
            placeholder="Provide some details"
            data-testid='editComment_body'
            defaultValue={comment.body}
        />

        <section className='u-alignRight'>
            <button type="submit" className="Button Button--primary">Save Comment</button>
        </section>
    </form>
);
