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
import IssueSegments from 'src/components/Issue/Segments';
import IssueEditFormSegments from 'src/components/IssueEditForm/Segments';

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
                <IssueSegments issue={issue}>
                    {({ Title, Body, Details }: { Title: any, Body: any, Details: any }) => (
                        <React.Fragment>
                            <div className='u-flexH u-centerCrossAxis'>

                                <div className='u-flexH'>
                                    <PermittedRender requiredLevel={PermissionLevel.Delete} resource={issue}>
                                        <button
                                            onClick={onDelete}
                                            className="Button Button--danger circle"
                                            title='Delete Issue'>
                                            X
                                        </button>
                                    </PermittedRender>

                                    <PermittedRender requiredLevel={PermissionLevel.Edit} resource={issue}>
                                        <button
                                            onClick={this.edit}
                                            className="Button Button--edit circle"
                                            title='Edit Issue'>
                                            E
                                        </button>

                                        {/* TODO: Run a mutation to close issue */}
                                        <button
                                            className="Button Button--close circle"
                                            title='Close Issue'>
                                            ✔
                                        </button>
                                    </PermittedRender>
                                </div>

                                <Title />
                            </div>

                            <Body />
                            <Details />
                        </React.Fragment>
                    )}
                </IssueSegments>
            </React.Fragment>
        );
    }

    private renderEdit(onDelete: any, onUpdate: any) {
        const { issue } = this.props;

        return (
            <React.Fragment>
                <IssueEditFormSegments issue={issue} onSubmit={submitFormMutation(onUpdate)}>
                    {({ TitleField, BodyField, SeverityField, TypeField, StatusField, SubmitBtn }: any) => (
                        <section className='u-flexV u-fullWidth'>
                            <section className='u-flexH u-centerCrossAxis u-fullWidth'>
                                <div className='u-flexH'>
                                    <PermittedRender requiredLevel={PermissionLevel.Delete} resource={issue}>
                                        <button
                                            onClick={onDelete}
                                            className="Button Button--danger circle"
                                            title='Delete Issue'
                                        >
                                            X
                                        </button>
                                    </PermittedRender>
                                    <SubmitBtn />
                                    <button onClick={this.details} className="Button circle" title='Cancel Edit'>C</button>
                                </div>
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
                </IssueEditFormSegments>
            </React.Fragment>
        );
    }
}
