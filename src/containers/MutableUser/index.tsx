import * as React from 'react';
import { Mutation } from 'react-apollo';
import { updateUser, deleteUser } from 'src/util/graphql/mutations';
import { submitFormMutation } from 'src/util/formSubmission';

// components
import UserEditForm from 'src/components/UserEditForm';
import UserDetails from 'src/components/User';

interface Props {
    user: User;
}

interface State {
    edit: boolean;
}

export default class Mutable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { edit: false };
    }

    public render() {
        return (
            <Mutation mutation={deleteUser} variables={{ id: this.props.user.id }}>
                { (deleteFn: any) => this.state.edit
                    ? (
                        <Mutation mutation={updateUser} onCompleted={this.details}>
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
        return (
            <div id="user_details">
                <UserDetails user={this.props.user} />
                <button id="user_delete" onClick={onDelete} className="Button Button--danger">Delete</button>
                <button id="user_edit" onClick={this.edit} className="Button">Edit</button>
            </div>
        );
    }

    private renderEdit(onDelete: any, onUpdate: any) {
        return (
            <div id="user_edit">
                <UserEditForm user={this.props.user} onSubmit={submitFormMutation(onUpdate)} />
                <button id="user_delete" onClick={onDelete} className="Button Button--danger">Delete</button>
                <button id="user_cancelEdit" onClick={this.details} className="Button">Cancel</button>
            </div>
        );
    }
}
