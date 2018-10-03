import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';
import * as classnames from 'classnames';

interface Props extends HTMLAttributes<HTMLFormElement> {
    issue: Issue;
    onSubmit: FormEventHandler;
    props?: any[];
}

export default ({ issue, onSubmit, className, ...props }: Props) => (
    <form onSubmit={onSubmit} className={classnames('u-flexH', className)} {...props}>
        <input
            type="text"
            name="id"
            data-testid='editIssue_issueID'
            value={issue.id}
            readOnly={true} hidden={true} disabled={true}
        />

        <section className="u-flexV">
            <input
                type="text"
                placeholder="Title"
                data-testid='editIssue_title'
                name="title"
                defaultValue={issue.title}
            />
            <textarea
                name="body"
                data-testid='editIssue_body'
                placeholder="Provide some details"
                rows={15}
                defaultValue={issue.body}
            />
        </section>

        <section className="u-flexV">
            <label htmlFor='severity'>Severity</label>
            <select
                id='severity'
                name="severity"
                defaultValue={issue.severity}
                data-testid='editIssue_severity'
            >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>

            <label htmlFor='type'>Type</label>
            <select
                id='type'
                name="type"
                defaultValue={issue.type}
                data-testid='editIssue_type'
            >
                <option value="bug">Bug</option>
                <option value="enhancement">Enhancement</option>
                <option value="question">Question</option>
            </select>

            <label htmlFor='status'>Status</label>
            <select
                id='status'
                name="status"
                defaultValue={issue.status}
                data-testid='editIssue_status'
            >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
            </select>

            <section>
                <button
                type="submit"
                className="Button Button--primary"
                data-testid='editIssue_submit'
            >
                    Save Issue
                </button>
            </section>
        </section>
    </form>
);
