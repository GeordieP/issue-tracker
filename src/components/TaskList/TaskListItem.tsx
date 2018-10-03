import * as React from 'react';
import { HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

interface Props extends HTMLAttributes<HTMLElement> {
    task: Task;
    linkBaseUrl?: string;
}

export default ({ task, linkBaseUrl }: Props) => (
    <div className="u-flexH u-stretchH">
        <div>
            <h2 className={ task.openStatus ? '' : 'u-strikethrough'}>
                • { linkBaseUrl
                    ? (
                        <Link
                            to={`${linkBaseUrl}/tasks/${task.id}`}
                            data-testid='taskListItem_titleLink'>
                            { task.title }
                        </Link>
                    )
                    : task.title
                }
            </h2>
        </div>
    </div>
);
