import * as React from 'react';
import { HTMLAttributes } from 'react';

import TaskListItem from './TaskListItem';

interface Props extends HTMLAttributes<HTMLElement> {
    tasks: Task[];
    linkBaseUrl?: string;
}

export default ({ tasks, linkBaseUrl }: Props): any =>
    tasks
        .slice(0)
        .sort((taskA, taskB) => taskA.openStatus ? -1 : 1)
        .map(task => (
            <TaskListItem
                key={task.id}
                task={task}
                linkBaseUrl={linkBaseUrl}
            />
        ));
