import * as React from 'react';
import { HTMLAttributes } from 'react';

import ProjectListItem from './ProjectListItem';

interface Props extends HTMLAttributes<HTMLElement> {
    projects: Project[];
}

export default ({ projects }: Props): any => projects.map(project => (
    <ProjectListItem
        key={project.id}
        project={project}
    />
));
