import * as React from 'react';
import { HTMLAttributes } from 'react';
import * as classnames from 'classnames';

interface Props extends HTMLAttributes<HTMLElement> {
    issue: Issue;
    props?: any[];
}

export default ({ issue, className, ...props }: Props) => (
    <div className={classnames('IssueList-item u-paddingHMed u-paddingVMed', className)} {...props}>
        <p className={classnames('IssueList-title', issue.status === 'closed' ? 'u-strikethrough' : '')}>{issue.title}</p>

        <div className="u-flexH u-stretchH u-spaceBetween">
            <h4 data-testid='issueListItem_date'>
                {new Date(issue.dateUpdated).toDateString()}
            </h4>
            <h4>{issue.type} | {issue.severity}</h4>
        </div>

        <div className="u-flexH u-stretchH u-spaceBetween">
            <h4 className="issueDetails">{issue.creator.username}</h4>
            <h4>{issue.status}</h4>
        </div>
    </div>
);
