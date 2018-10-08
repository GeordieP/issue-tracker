import * as React from 'react';
import { FormEventHandler } from 'react';

// components
import IssueEditSegments from './Segments';

interface Props {
    issue: Issue;
    onSubmit: FormEventHandler;
    className?: string;
}

const callMe = () => {
    console.log('i was called');
}

// Default layout for issue edit form
export default ({ issue, onSubmit, className }: Props) => (
    <IssueEditSegments issue={issue} onSubmit={callMe} className={className}>
        {({ TitleField, BodyField, SeverityField, TypeField, StatusField, SubmitBtn }: any) => (
            <React.Fragment>
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
            </React.Fragment>
        )}
    </IssueEditSegments>
);
