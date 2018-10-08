import * as React from 'react';
import { HTMLAttributes } from 'react';

import './Issue.css';

interface Props extends HTMLAttributes<HTMLElement> {
    issue: Issue;
    props?: any[];
    children: any;
}

export default ({ issue, children, ...props }: Props) => {
    const renderTitle = () => (
        <h1 className='u-noMargin'>{issue.title}</h1>
    );

    const renderBody = () => (
        <pre>{issue.body}</pre>
    );

    const renderDetails = () => (
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
    );

    return children({
        Title: renderTitle,
        Body: renderBody,
        Details: renderDetails,
    })
}
