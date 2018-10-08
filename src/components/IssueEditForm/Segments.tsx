import * as React from 'react';
import { FormEventHandler } from 'react';
import * as classnames from 'classnames';

interface Props {
    issue: Issue;
    onSubmit: FormEventHandler;
    className?: string;
    children: any;
}

export default ({ issue, onSubmit, children, className }: Props) => {
    const renderTitleField = () => (
        <input
            type="text"
            placeholder="Title"
            data-testid='editIssue_title'
            name="title"
            className='u-fullWidth'
            defaultValue={issue.title}
        />
    );

    const renderBodyField = () => (
        <textarea
            name="body"
            data-testid='editIssue_body'
            placeholder="Provide some details"
            rows={15}
            defaultValue={issue.body}
        />
    );

    const renderSeverity = () => (
        <div>
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
        </div>
    );

    const renderType = () => (
        <div>
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
        </div>
    );

    const renderStatus = () => (
        <div>
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
        </div>
    );

    const renderSubmitBtn = () => (
        <section>
            <button
            type="submit"
            className="Button Button--save circle"
            data-testid='editIssue_submit'
            title='Save Issue'
        >
                S
            </button>
        </section>
    );

    // render the form and hidden fields, then call children function with all the form segments.
    // Make sure to render the children as a child of the form.
    return (
        <form onSubmit={onSubmit} className={classnames('u-flexH', className)}>
            <input
                type="text"
                name="id"
                data-testid='editIssue_issueID'
                value={issue.id}
                readOnly={true} hidden={true} disabled={true}
            />

            {
                children({
                    TitleField: renderTitleField,
                    BodyField: renderBodyField,
                    SeverityField: renderSeverity,
                    TypeField: renderType,
                    StatusField: renderStatus,
                    SubmitBtn: renderSubmitBtn,
                })
            }
        </form>
    );
}
