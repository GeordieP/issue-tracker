import * as React from 'react';
import { Mutation } from 'react-apollo';
import { updateComment, deleteComment } from 'src/util/graphql/mutations';
import { getComments } from 'src/util/graphql/queries';
import { submitFormMutation } from 'src/util/formSubmission';
import AuthorRender from 'src/containers/Permissions/AuthorRender';
import PermittedRender from 'src/containers/Permissions/PermittedRender';
import { PermissionLevel } from 'src/types/Permissions';

// components
import CommentEditForm from 'src/components/CommentEditForm';
import CommentDetails from 'src/components/Comment';

interface Props {
    parentID: ID;
    comment: Comment;
}

interface State {
    edit: boolean;
}

export default class MutableComment extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { edit: false };
    }

    public render() {
        return (
            <Mutation
                mutation={deleteComment}
                variables={{ id: this.props.comment.id }}
                refetchQueries={[{
                    query: getComments,
                    variables: { parent: this.props.parentID }
                }]}
            >
                { (deleteFn: any) => this.state.edit
                    ? (
                        <Mutation mutation={updateComment} onCompleted={this.details}>
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
        const { comment } = this.props;

        return (
            <React.Fragment >
                <CommentDetails comment={comment} className='MutableComment-commentDetails' />

                <div className='u-alignRight'>
                    <PermittedRender requiredLevel={PermissionLevel.Delete} resource={comment}>
                        <button onClick={onDelete} className="Button Button--danger">Delete Comment</button>
                    </PermittedRender>

                    <AuthorRender resource={comment}>
                        <button onClick={this.edit} className="Button">Edit Comment</button>
                    </AuthorRender>
                </div>
            </React.Fragment>
        );
    }

    private renderEdit(onDelete: any, onUpdate: any) {
        const { comment } = this.props;

        return (
            <div className='u-alignRight' style={{ background: 'var(--col-mono2)' }}>
                <CommentEditForm comment={comment} onSubmit={submitFormMutation(onUpdate)} />

                <PermittedRender requiredLevel={PermissionLevel.Delete} resource={comment}>
                    <button onClick={onDelete} className="Button Button--danger">Delete Comment</button>
                </PermittedRender>

                <button onClick={this.details} className="Button">Cancel</button>
            </div>
        );
    }
}
