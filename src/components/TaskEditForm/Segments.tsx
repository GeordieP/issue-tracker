import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';
import * as classnames from 'classnames';

interface Props extends HTMLAttributes<HTMLFormElement> {
    task: Task;
    onSubmit: FormEventHandler;
    className?: string;
    children: any;
    props?: any[];
}

export default ({ task, onSubmit, className, children }: Props) => {
    const renderTitle = () => (
        <input
            type="text"
            placeholder="Title"
            data-testid="editTask_title"
            className='u-fullWidth'
            name="title"
            defaultValue={task.title}
        />
    );

    const renderBody = () => (
        <textarea
            name="body"
            placeholder="Provide some details"
            data-testid="editTask_body"
            rows={15}
            defaultValue={task.body}
         />
    );

    const renderStatus = () => (
        <div>
            <label htmlFor="editTask_openStatus">Open</label>
            <input
                type="checkbox"
                data-testid="editTask_openStatus"
                name="openStatus"
                defaultChecked={task.openStatus}
            />
        </div>
    );

    const renderSubmitBtn = () => (
        <button
            type="submit"
            className="Button Button--save circle"
            data-testid='editTask_submit'>
            S
        </button>
    );

    return (
        <form onSubmit={onSubmit} className={classnames('u-flexH', className)}>
            <input
                type="text"
                name="id"
                value={task.id}
                data-testid='editTask_taskID'
                readOnly={true} hidden={true} disabled={true}
            />

            {
                children({
                    TitleField: renderTitle,
                    BodyField: renderBody,
                    StatusField: renderStatus,
                    SubmitBtn: renderSubmitBtn,
                })
            }
        </form>
    );
}


// export default ({ task, onSubmit, className, ...props }: Props) => (
//     <form
//         onSubmit={onSubmit}
//         className={classnames('u-flexH', className)}
//         {...props}
//     >
//         <section className="u-flexV">
//         </section>
//
//         <section className="u-flexV">
//
//         </section>
//     </form>
// );
