import * as React from 'react';
import { Mutation } from 'react-apollo';
import history from 'src/util/history';
import { match } from 'react-router-dom';
import { updateIssue, deleteIssue } from 'src/util/graphql/mutations';
import { getIssuesForProject } from 'src/util/graphql/queries';
import { submitFormMutation } from 'src/util/formSubmission';
import PermittedRender from 'src/containers/Permissions/PermittedRender';
import { PermissionLevel } from 'src/types/Permissions';

// components
import IssueDetails from 'src/components/Issue';
import IssueEditForm from 'src/components/IssueEditForm';

interface Props {
    issue: Issue
    match: match<RouteParams>;
}

interface State {
    edit: boolean;
}

export default class MutableIssue extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { edit: false }
    }

    public render() {
        return (
            <Mutation
                mutation={deleteIssue}
                variables={{ id: this.props.issue.id }}
                onCompleted={history.push.bind(null, this.props.match.url.replace(/\/issues.+/g, '/issues'))}
                awaitRefetchQueries={true} // wait until query finishes before redirecting to avoid conflicts with FirstIssueRedirect component
                refetchQueries={[{
                    query: getIssuesForProject,
                    variables: { project: this.props.match.params.projectID },
                }]}
            >
                { (deleteFn: any) => this.state.edit
                    ? (
                        <Mutation mutation={updateIssue} onCompleted={this.details}>
                            { (editFn: any) => this.renderEdit(deleteFn, editFn) }
                        </Mutation>
                    ) : (
                        this.renderDetails(deleteFn)
                    )
                }
            </Mutation>
        );
    }

    private edit = () => this.setState({ edit: true });
    private details = () => this.setState({ edit: false });

    private renderDetails(onDelete: any) {
        const { issue } = this.props;

        return (
            <React.Fragment>
                <IssueDetails issue={issue} />

                <section className='u-marginBottomSmall'>
                    <PermittedRender requiredLevel={PermissionLevel.Edit} resource={issue}>
                        <button onClick={this.edit} className="Button">Edit Issue</button>
                    </PermittedRender>

                    <PermittedRender requiredLevel={PermissionLevel.Delete} resource={issue}>
                        <button onClick={onDelete} className="Button Button--danger">Delete Issue</button>
                    </PermittedRender>
                </section>
            </React.Fragment>
        );
    }

    private renderEdit(onDelete: any, onUpdate: any) {
        const { issue } = this.props;

        return (
            <React.Fragment>
                <IssueEditForm issue={issue} onSubmit={submitFormMutation(onUpdate)} />
                <PermittedRender requiredLevel={PermissionLevel.Delete} resource={issue}>
                    <button onClick={onDelete} className="Button Button--danger">Delete Issue</button>
                </PermittedRender>

                <button onClick={this.details} className="Button">Cancel</button>
            </React.Fragment>
        );
    }
}
