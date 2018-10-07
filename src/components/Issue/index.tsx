import * as React from 'react';
import { HTMLAttributes } from 'react';

import './Issue.css';

interface Props extends HTMLAttributes<HTMLElement> {
    issue: Issue;
    props?: any[];
}

export default ({ issue, ...props }: Props) => (
    <div {...props}>
        <h1>{issue.title}</h1>
        <pre>{issue.body}</pre>

        <section className='Issue-details u-marginTopLarge'>
            <section>
                <h4 data-testid='issue_date'>
                    {new Date(issue.dateUpdated).toDateString()}
                </h4>
                <h4>
                    <span>By </span>{issue.creator.username}
                </h4>
            </section>

            <section className='u-alignRight'>
                <h4>{issue.type} | {issue.severity}</h4>
                <h4>{issue.status}</h4>
            </section>
        </section>
    </div>
);
