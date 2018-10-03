import * as React from 'react';
import { Mutation } from 'react-apollo';
import history from 'src/util/history';
import { updateProject, deleteProject } from 'src/util/graphql/mutations';
import { getProjects } from 'src/util/graphql/queries';
import { submitFormMutation } from 'src/util/formSubmission';
import PermittedRender from 'src/containers/Permissions/PermittedRender';
import { PermissionLevel } from 'src/types/Permissions';

// components
import ProjectEditForm from 'src/components/ProjectEditForm';
import ProjectDetails from 'src/components/Project';

interface Props {
    project: Project;
}

interface State {
    edit: boolean;
}

export default class MutableProject extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { edit: false, }
    }

    public render() {
        return (
            <Mutation
                mutation={deleteProject}
                variables={{ id: this.props.project.id }}
                onCompleted={history.push.bind(null, '/projects')}
                refetchQueries={[{ query: getProjects }]}
            >
                { (deleteFn: any) => this.state.edit
                    ? (
                        <Mutation mutation={updateProject} onCompleted={this.details}>
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
        const { project } = this.props;

        return (
            <React.Fragment>
                <ProjectDetails project={project} />

                <PermittedRender requiredLevel={PermissionLevel.Edit} resource={project}>
                    <button onClick={this.edit} className="Button">Edit</button>
                </PermittedRender>

                <PermittedRender requiredLevel={PermissionLevel.Delete} resource={project}>
                    <button onClick={onDelete} className="Button Button--danger">Delete</button>
                </PermittedRender>
            </React.Fragment>
        );
    }

    private renderEdit(onDelete: any, onUpdate: any) {
        const { project } = this.props;

        return (
            <React.Fragment>
                <ProjectEditForm project={project} onSubmit={submitFormMutation(onUpdate)} />

                <PermittedRender requiredLevel={PermissionLevel.Delete} resource={project}>
                    <button onClick={onDelete} className="Button Button--danger">Delete</button>
                </PermittedRender>

                <button onClick={this.details} className="Button">Cancel</button>
            </React.Fragment>
        );
    }
}
