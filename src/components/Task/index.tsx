import * as React from 'react';
import { HTMLAttributes } from 'react';

import TaskSegments from './Segments';

interface Props extends HTMLAttributes<HTMLElement> {
    task: Task;
    props?: any[];
}

export default ({ task, ...props }: Props) => (
    <TaskSegments task={task}>
        {({ Title, Body, Status }: any) => (
            <div {...props}>
                <Title />
                <Status />
                <Body />
            </div>
        )}
    </TaskSegments>
);
