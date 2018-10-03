import * as React from 'react';
import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
    project: Project;
    props?: any[];
}

export default ({ project, ...props }: Props) => (
    <div {...props}>
        <h1>{project.name}</h1>
        <h1>{project.alias}</h1>
        <h2>{project.creator.username}</h2>
    </div>
);
