import * as React from 'react';
import { HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

import './TaskListItem.css';

interface Props extends HTMLAttributes<HTMLElement> {
    task: Task;
    linkBaseUrl?: string;
}

const buildDate = (timestamp: any) => {
    const d = new Date(timestamp);
    return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
}

export default ({ task, linkBaseUrl }: Props) => {
    const renderTitle = () => linkBaseUrl
        ? <Link
                to={`${linkBaseUrl}/tasks/${task.id}`}
                data-testid='taskListItem_titleLink'
                style={{ color: 'var(--clr-primary)'}}
            >
            { task.title }
        </Link>
        : task.title

    return (
        <div className='TaskListItem u-flexV'>
                <h3
                    className={ task.openStatus ? '' : 'u-strikethrough'}
                    style={{ color: 'var(--clr-primary)'}}
                >
                    { renderTitle() }
                </h3>

                <div
                    className='u-flexH u-fullWidth u-spaceBetween'
                    style={{ color: 'rgba(var(--rgb-primary), 0.4)'}}
                >
                    <h4>{ task.creator.username }</h4>
                    <h4 title='D/M/Y'>{ buildDate(task.dateUpdated) }</h4>
                </div>
        </div>
    );
}
