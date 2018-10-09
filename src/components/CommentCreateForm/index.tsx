import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';

interface Props extends HTMLAttributes<HTMLFormElement> {
    parentID: ID;
    parentType: CommentParentType;
    onSubmit: FormEventHandler;
    props?: any[];
}

export default ({ parentID, parentType, onSubmit, ...props }: Props) => (
    <form onSubmit={onSubmit} {...props}>
        <input
            type="text"
            data-testid="createComment_parent"
            name="parent"
            value={parentID}
            readOnly={true} hidden={true} disabled={true}
        />
        <input
            type="text"
            data-testid="createComment_parentType"
            name="parentType"
            value={parentType}
            readOnly={true} hidden={true} disabled={true}
        />

        <textarea
            data-testid="createComment_body"
            name="body"
            placeholder="Write your comment"
            className='u-fullWidth'
        />

        <section>
            <button type="submit" className="Button Button--primary" data-testid="createComment_submit">Submit Comment</button>
        </section>
    </form>
);
