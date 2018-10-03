import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';
import * as classnames from 'classnames';

interface Props extends HTMLAttributes<HTMLFormElement> {
    task: Task;
    onSubmit: FormEventHandler;
    props?: any[];
}

export default ({ task, onSubmit, className, ...props }: Props) => (
    <form
        onSubmit={onSubmit}
        className={classnames('u-flexH', className)}
        {...props}
    >
        <input
            type="text"
            name="id"
            value={task.id}
            data-testid='editTask_taskID'
            readOnly={true} hidden={true} disabled={true}
        />

        <section className="u-flexV">
            <input
                type="text"
                placeholder="Title"
                data-testid="editTask_title"
                name="title"
                defaultValue={task.title}
            />
            <textarea
                name="body"
                placeholder="Provide some details"
                data-testid="editTask_body"
                rows={15}
                defaultValue={task.body}
             />
        </section>

        <section className="u-flexV">
            <label htmlFor="editTask_openStatus">Open</label>
            <input
                type="checkbox"
                data-testid="editTask_openStatus"
                name="openStatus"
                defaultChecked={task.openStatus}
            />

            <button
                type="submit"
                className="Button Button--primary"
                data-testid='editTask_submit'
            >
                Save Task
            </button>
        </section>
    </form>
);
