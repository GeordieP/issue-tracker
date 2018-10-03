import * as React from 'react';
import { Mutation } from 'react-apollo';
import { match } from 'react-router-dom';
import history from 'src/util/history';
import { updateTask, deleteTask } from 'src/util/graphql/mutations';
import { getTasksForIssue } from 'src/util/graphql/queries';
import { submitFormMutation } from 'src/util/formSubmission';
import PermittedRender from 'src/containers/Permissions/PermittedRender';
import { PermissionLevel } from 'src/types/Permissions';

// components
import TaskEditForm from 'src/components/TaskEditForm';
import TaskDetails from 'src/components/Task';

interface Props {
    task: Task;
    match: match<RouteParams>;
}

interface State {
    edit: boolean;
}

export default class MutableTask extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { edit: false, }
    }

    public render() {
        return (
            <Mutation
                mutation={deleteTask}
                variables={{ id: this.props.task.id }}
                onCompleted={history.push.bind(null, this.props.match.url.replace(/\/tasks.+/g, ''))}
                refetchQueries={[{
                    query: getTasksForIssue,
                    variables: { parent: this.props.match.params.issueID }
                }]}
            >
                { (deleteFn: any) => this.state.edit
                    ? (
                        <Mutation mutation={updateTask} onCompleted={this.details}>
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
        const { task } = this.props;

        return (
            <React.Fragment>
                <TaskDetails task={task} />

                <PermittedRender requiredLevel={PermissionLevel.Edit} resource={task}>
                    <button onClick={this.edit} className="Button">Edit Task</button>
                </PermittedRender>

                <PermittedRender requiredLevel={PermissionLevel.Delete} resource={task}>
                    <button onClick={onDelete} className="Button Button--danger">Delete Task</button>
                </PermittedRender>
            </React.Fragment>
        );
    }

    private renderEdit(onDelete: any, onUpdate: any) {
        const { task } = this.props;

        return (
            <React.Fragment>
                <TaskEditForm task={task} onSubmit={submitFormMutation(onUpdate)} />

                <PermittedRender requiredLevel={PermissionLevel.Delete} resource={task}>
                    <button onClick={onDelete} className="Button Button--danger">Delete Task</button>
                </PermittedRender>

                <button onClick={this.details} className="Button">Cancel</button>
            </React.Fragment>
        );
    }
}
