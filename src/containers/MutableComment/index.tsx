import * as React from 'react';
import { Mutation } from 'react-apollo';
import { updateComment, deleteComment } from 'src/util/graphql/mutations';
import { getComments } from 'src/util/graphql/queries';
import { submitFormMutation } from 'src/util/formSubmission';
import AuthorRender from 'src/containers/Permissions/AuthorRender';
import PermittedRender from 'src/containers/Permissions/PermittedRender';
import { PermissionLevel } from 'src/types/Permissions';

// components
import CommentEditForm from 'src/components/CommentEditForm/Segments';
import CommentDetails from 'src/components/Comment/Segments';

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
            <React.Fragment>
                <CommentDetails comment={comment}>
                    {({ Author, Body }: any) => (
                        <React.Fragment>
                            <section className='u-flexH'>
                                <Author />

                                <PermittedRender requiredLevel={PermissionLevel.Delete} resource={comment}>
                                    <button onClick={onDelete} className="Button Button--danger circle">X</button>
                                </PermittedRender>

                                <AuthorRender resource={comment}>
                                    <button onClick={this.edit} className="Button Button--edit circle">E</button>
                                </AuthorRender>
                            </section>

                            <Body />
                        </React.Fragment>
                    )}
                </CommentDetails>
            </React.Fragment>
        );
    }

    private renderEdit(onDelete: any, onUpdate: any) {
        const { comment } = this.props;

        return (
            <div>
                <CommentEditForm comment={comment} onSubmit={submitFormMutation(onUpdate)}>
                    {({ BodyField, SubmitBtn }: any) => (
                        <React.Fragment>
                            <div>
                                <PermittedRender requiredLevel={PermissionLevel.Delete} resource={comment}>
                                    <button onClick={onDelete} className="Button Button--danger circle">X</button>
                                </PermittedRender>

                                <button onClick={this.details} className="Button circle">C</button>
                                <SubmitBtn />
                            </div>
                            <BodyField />
                        </React.Fragment>
                    )}
                </CommentEditForm>
            </div>
        );
    }
}
