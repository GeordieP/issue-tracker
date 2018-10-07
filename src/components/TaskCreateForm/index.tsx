import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';

interface Props extends HTMLAttributes<HTMLFormElement> {
    parentID: ID;
    onSubmit: FormEventHandler;
    props?: any[];
}

export default ({ parentID, onSubmit, ...props }: Props) => (
    <form className="u-flexH" onSubmit={onSubmit} {...props}>
        <section className="u-flexV u-fullWidth">
            <input
                type="text"
                name="parent"
                value={parentID}
                data-testid='createTask_parentID'
                readOnly={true} hidden={true} disabled={true}
            />

            <input
                type="text"
                placeholder="Title"
                name="title"
                data-testid='createTask_title'
            />
            <textarea
                name="body"
                placeholder="Provide some details"
                data-testid='createTask_body'
            />

            <section className='u-flexH u-spaceBetween u-centerCrossAxis'>
                <div>
                    <label htmlFor="createTask_openStatus">Open </label>
                    <input
                        type="checkbox"
                        data-testid="createTask_openStatus"
                        name="openStatus"
                        defaultChecked={true}
                    />
                </div>

                <button
                    type="submit"
                    className="Button Button--primary"
                    data-testid='createTask_submit'
                >
                    Create Task
                </button>
            </section>
        </section>
    </form>
);
