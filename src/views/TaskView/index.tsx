import * as React from 'react';
import { graphql, Query, QueryResult } from 'react-apollo';
import { Redirect, match as Match } from 'react-router-dom';
import { getTask, getComments } from 'src/util/graphql/queries';
import PermittedRender from 'src/containers/Permissions/PermittedRender';
import { Route } from 'react-router-dom';

// types
import { PermissionLevel } from 'src/types/Permissions';
import { CommentParentType } from 'src/types/Comments';

// components
import Breadcrumbs from 'src/containers/Breadcrumbs';
import NotPermittedRender from 'src/containers/Permissions/NotPermittedRender';
import LoadingSpinner from 'src/components/LoadingSpinner';
import LoadingError from 'src/components/LoadingError';
import MutableTask from 'src/containers/MutableTask';
import MutableCommentList from 'src/containers/MutableCommentList';
import CommentCreate from 'src/containers/CommentCreate';

import './TaskView.css';

interface InitialProps {
    match: Match<RouteParams>;
}

// extra props coming from apollo query
interface Props extends InitialProps {
    qry_getTask: any;
}

const TaskView = ({
    match,
    qry_getTask: {
        loading: taskLoading,
        error: taskError,
        task,
    }
}: Props) => {
    if (taskLoading) return <LoadingSpinner message="Loading task" />
    if (taskError) return <LoadingError error={taskError} />

    return (
        <div className="TaskView">
            <Route component={Breadcrumbs} />

            <NotPermittedRender requiredLevel={PermissionLevel.Read} resource={task}>
                <Redirect to='/401' />
            </NotPermittedRender>

            <section className='u-marginBottomLarge'>
                <MutableTask
                    task={task}
                    match={match}
                />
            </section>

            <h2>Comments</h2>
            <hr />
            <section className='u-marginBottomMed u-marginTopMed'>
                <PermittedRender requiredLevel={PermissionLevel.Create} resource={task}>
                    <h3>New Comment</h3>
                    <CommentCreate parentID={match.params.taskID} parentType={CommentParentType.TASK} />
                </PermittedRender>

                <Query query={getComments} variables={{ parent: match.params.taskID }}>
                    {({ loading, error, data }: QueryResult) => {
                        if (loading) return <LoadingSpinner message='Loading comments...' />
                        if (error) return <LoadingError error={error} />

                        if (!data.comments || data.comments.length === 0)
                            return <h4>No comments.</h4>

                        return <MutableCommentList
                            comments={data.comments}
                            parentID={match.params.taskID}
                        />
                    }}
                </Query>
            </section>
        </div>
    );
}

export default graphql(getTask, {
    name: 'qry_getTask',
    options: ({ match }: InitialProps) => ({
        variables: {
            id: match.params.taskID
        }
    })
})(TaskView);
