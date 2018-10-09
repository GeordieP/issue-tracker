import * as React from 'react';
import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
    task: Task;
    children: any;
}

export default ({ task, children }: Props) => {
    const renderTitle = () => (
        <h1 className='u-noMargin'>{task.title}</h1>
    );

    const renderBody = () => (
        <p>{ task.body || '' }</p>
    );

    const renderStatus = () => (
        <div>
            <label htmlFor={`task_${task.id}_openStatus`}>Open</label>
            <input
                type="checkbox"
                id={`task_${task.id}_openStatus`}
                defaultChecked={task.openStatus}
                readOnly={true}
                disabled={true}
            />
        </div>
    );

    return children({
        Title: renderTitle,
        Body: renderBody,
        Status: renderStatus,
    });
}
