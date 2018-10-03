import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';
import * as classnames from 'classnames';

interface Props extends HTMLAttributes<HTMLFormElement> {
    projectID: ID;
    onSubmit: FormEventHandler;
    props?: any[];
}

export default ({ projectID, onSubmit, className, ...props }: Props) => (
    <form onSubmit={onSubmit} className={classnames('u-flexH', className)} {...props}>
        <input
            type="text"
            name="project"
            data-testid="createIssue_projectID"
            value={projectID}
            readOnly={true} hidden={true} disabled={true}
        />

        <section className="u-flexV">
            <input
                type="text"
                placeholder="Title"
                name="title"
                data-testid='createIssue_title'
            />

            <textarea
                name="body"
                placeholder="Provide some details"
                data-testid='createIssue_body'
            />
        </section>

        <section className="u-flexV">
            <select
                name="severity"
                defaultValue="medium"
                data-testid='createIssue_severity'
            >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>

            <select
                name="type"
                data-testid='createIssue_type'
            >
                <option value="bug">Bug</option>
                <option value="enhancement">Enhancement</option>
                <option value="question">Question</option>
            </select>

            <section>
                <button
                    type="submit"
                    className="Button Button--primary"
                    data-testid='createIssue_submit'
                >
                    Create Issue
                </button>
            </section>
        </section>
    </form>
);
