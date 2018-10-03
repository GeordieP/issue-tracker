import * as React from 'react';
import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
    task: Task;
    props?: any[];
}

export default ({ task, ...props }: Props) => (
    <div {...props}>
        <h1>{task.title}</h1>

        <label htmlFor={`task_${task.id}_openStatus`}>Open</label>
        <input
            type="checkbox"
            id={`task_${task.id}_openStatus`}
            defaultChecked={task.openStatus}
            readOnly={true}
            disabled={true}
        />

        <p>{ task.body || '' }</p>
    </div>
);
