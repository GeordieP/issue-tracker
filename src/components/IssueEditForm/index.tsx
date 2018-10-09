import * as React from 'react';
import { FormEventHandler } from 'react';

// components
import IssueEditSegments from './Segments';

interface Props {
    issue: Issue;
    onSubmit: FormEventHandler;
    className?: string;
}

// Default layout for issue edit form
export default ({ issue, onSubmit, className }: Props) => (
    <IssueEditSegments issue={issue} onSubmit={onSubmit} className={className}>
        {({ TitleField, BodyField, SeverityField, TypeField, StatusField, SubmitBtn }: any) => (
            <section className='u-flexV u-fullWidth'>
                <section className='u-flexH u-centerCrossAxis u-fullWidth'>
                    <SubmitBtn />
                    <TitleField />
                </section>

                <BodyField />

                <section className='u-flexH u-spaceBetween'>
                    <SeverityField />
                    <TypeField />
                    <StatusField />
                </section>
            </section>
        )}
    </IssueEditSegments>
);
