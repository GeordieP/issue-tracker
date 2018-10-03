import * as React from 'react';
import { HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import * as classnames from 'classnames';

import IssueListItem from './IssueListItem';
import './IssueList.css';

interface Props extends HTMLAttributes<HTMLElement> {
    issues: Issue[];
    linkBaseUrl?: string;
    match?: any;
}

export default ({ issues, linkBaseUrl, match }: Props): any => {
    // sort issues based on open status (closed on bottom)
    issues = issues
        .slice(0)
        .sort((issA, issB) => issA.status.toLowerCase() === 'open' ? -1 : 1);

    if (linkBaseUrl) {
        if (!match) {
            throw new Error('If rendering an IssueList with a linkBaseUrl prop, please also provide a router match prop.');
        }

        return issues.map(issue => (
            <Link to={`${linkBaseUrl}/issues/${issue.id}`} key={issue.id} className='u-noDecoration'>
                <IssueListItem
                    issue={issue}
                    className={classnames(
                        'IssueList-item--clickable',
                        (issue.id === match.params.issueID) ? 'is-selected' : false
                    )}
                />
            </Link>
        ));
    }

    return issues.map(issue => (
        <IssueListItem key={issue.id} issue={issue} className='IssueList-item' />
    ));
}
