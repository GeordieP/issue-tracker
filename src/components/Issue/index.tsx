import * as React from 'react';
import { HTMLAttributes } from 'react';

import './Issue.css';
import IssueSegments from './Segments';

interface Props extends HTMLAttributes<HTMLElement> {
    issue: Issue;
    props?: any[];
}

export default ({ issue, ...props }: Props) => (
    <div {...props}>
        <IssueSegments issue={issue}>
            {({ Title, Body, Details }: { Title: any, Body: any, Details: any }) => (
                <React.Fragment>
                    <Title />
                    <Body />
                    <Details />
                </React.Fragment>
            )}
        </IssueSegments>
    </div>
);
