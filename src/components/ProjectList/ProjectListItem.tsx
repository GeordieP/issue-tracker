import * as React from 'react';
import { HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

import './ProjectListItem.css';

interface Props extends HTMLAttributes<HTMLElement> {
    project: Project;
}

export default ({ project }: Props) => (
    <div className="ProjectListItem u-fullWidth u-spaceBetween u-centerCrossAxis">
        <Link to={`/projects/${project.id}`}><h1>{project.name}</h1></Link>
        <div className='u-alignRight'>
            <h2>{project.creator.username}</h2>
            <h3>{project.alias}</h3>
        </div>
    </div>
);
