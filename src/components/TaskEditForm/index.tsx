import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';
// import * as classnames from 'classnames';

import TaskEditSegments from './Segments';

interface Props extends HTMLAttributes<HTMLFormElement> {
    task: Task;
    onSubmit: FormEventHandler;
    props?: any[];
}

export default ({ task, onSubmit, className, ...props }: Props) => (
    <TaskEditSegments task={task} onSubmit={onSubmit}>
        {({ TitleField, BodyField, StatusField, SubmitBtn }: any) => (
            <React.Fragment>
                <section className='u-flexV'>
                    <div className='u-flexH u-centerCrossAxis'>
                        <div>
                            <SubmitBtn />
                        </div>
                        <TitleField />
                    </div>

                    <BodyField />

                    <StatusField />
                </section>
            </React.Fragment>
        )}
    </TaskEditSegments>
);
