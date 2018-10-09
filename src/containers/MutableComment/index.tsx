import * as React from 'react';
import { Mutation } from 'react-apollo';
import { updateComment, deleteComment } from 'src/util/graphql/mutations';
import { getComments } from 'src/util/graphql/queries';
import { submitFormMutation } from 'src/util/formSubmission';
import AuthorRender from 'src/containers/Permissions/AuthorRender';
import PermittedRender from 'src/containers/Permissions/PermittedRender';
import { PermissionLevel } from 'src/types/Permissions';
import { Trash2 as TrashIcon, Edit as EditIcon, X as XIcon, User as UserIcon } from 'react-feather';

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

const Avatar = () => (
    <div className='Avatar'>
        <UserIcon />
    </div>
);

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
                    {({ Author, Date, Body }: any) => (
                        <React.Fragment>
                            <div className='u-flexH u-centerCrossAxis u-spaceBetween'>
                                <div className='u-flexH u-centerCrossAxis'>
                                    <Avatar />
                                    <Author />

                                    <PermittedRender requiredLevel={PermissionLevel.Delete} resource={comment}>
                                        <button onClick={onDelete} className="SmallButton" title='Delete Comment'><TrashIcon /></button>
                                    </PermittedRender>

                                    <AuthorRender resource={comment}>
                                        <button onClick={this.edit} className="SmallButton" title='Edit Comment'><EditIcon /></button>
                                    </AuthorRender>
                                </div>

                                <hr style={{ margin: '0 20px', background: '#e8e8e8'}}/>

                                <div style={{ flexShrink: 0 }}>
                                    <Date />
                                </div>
                            </div>

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
                    {({ Author, Date, BodyField, SubmitBtn }: any) => (
                        <React.Fragment>
                            <div className='u-flexH u-centerCrossAxis u-spaceBetween'>
                                <div className='u-flexH u-centerCrossAxis'>
                                    <Avatar />
                                    <Author />

                                    <PermittedRender requiredLevel={PermissionLevel.Delete} resource={comment}>
                                        <button onClick={onDelete} className="SmallButton SmallButton--danger" title='Delete Comment' ><TrashIcon /></button>
                                    </PermittedRender>

                                    <button onClick={this.details} className="SmallButton" title='Cancel Edit'><XIcon /></button>
                                    <SubmitBtn />
                                </div>

                                <hr style={{ margin: '0 20px', background: '#e8e8e8'}}/>

                                <div style={{ flexShrink: 0 }}>
                                    <Date />
                                </div>
                            </div>
                            <BodyField />
                        </React.Fragment>
                    )}
                </CommentEditForm>
            </div>
        );
    }
}
