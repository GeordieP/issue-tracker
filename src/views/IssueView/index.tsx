import * as React from 'react';
import { graphql, Query, QueryResult } from 'react-apollo';
import { Redirect, match as Match } from 'react-router-dom';
import { getIssue, getTasksForIssue, getComments } from 'src/util/graphql/queries';
import { Route } from 'react-router-dom';

// types
import { PermissionLevel } from 'src/types/Permissions';
import { CommentParentType } from 'src/types/Comments';

// components
import Breadcrumbs from 'src/containers/Breadcrumbs';
import NotPermittedRender from 'src/containers/Permissions/NotPermittedRender';
import PermittedRender from 'src/containers/Permissions/PermittedRender';
import LoadingSpinner from 'src/components/LoadingSpinner';
import LoadingError from 'src/components/LoadingError';
import MutableIssue from 'src/containers/MutableIssue';
import TaskList from 'src/components/TaskList';
import MutableCommentList from 'src/containers/MutableCommentList';
import TaskCreate from 'src/containers/TaskCreate';
import CommentCreate from 'src/containers/CommentCreate';

import './IssueView.css';

// props before apollo query
interface InitialProps {
    match: Match<RouteParams>;
}

// extra props coming from apollo query
interface Props extends InitialProps {
    qry_getIssue: any;
}

const IssueView = ({
    match,
    qry_getIssue: {
        loading: issueLoading,
        error: issueError,
        issue,
    }
}: Props) => {
    if (issueLoading) return <LoadingSpinner message='Loading issue...' />
    if (issueError) return <LoadingError error={issueError} />

    return (
        <div className="IssueView">
            <NotPermittedRender requiredLevel={PermissionLevel.Read} resource={issue}>
                <Redirect to='/401' />
            </NotPermittedRender>

            <div className="IssueView-content">
                <Route component={Breadcrumbs} />

                <section className='u-marginBottomLarge'>
                    <MutableIssue
                        issue={issue}
                        match={match}
                    />
                </section>

                <h2>Comments</h2>
                <hr />
                <section className='u-marginBottomMed u-marginTopMed'>
                    <PermittedRender requiredLevel={PermissionLevel.Create} resource={issue}>
                        <div className='u-marginBottomLarge'>
                            <h3>New Comment</h3>
                            <CommentCreate
                                parentID={match.params.issueID}
                                parentType={CommentParentType.ISSUE}
                                className='u-flexV u-fullWidth u-alignRight'
                            />
                        </div>
                    </PermittedRender>

                    <Query query={getComments} variables={{ parent: match.params.issueID }}>
                        {({ loading, error, data }: QueryResult) => {
                            if (loading) return <LoadingSpinner message='Loading comments...' />
                            if (error) return <LoadingError error={error} />

                            if (!data.comments || data.comments.length === 0)
                                return <h4>No comments.</h4>

                            return <MutableCommentList
                                comments={data.comments}
                                parentID={match.params.issueID}
                            />
                        }}
                    </Query>
                </section>
            </div>

            <div className="IssueView-sidebar">
                <h2>Tasks</h2>

                <section className='u-marginBottomLarge u-marginTopMed'>
                    <PermittedRender requiredLevel={PermissionLevel.Create} resource={issue}>
                        <h3>New Task</h3>
                        <TaskCreate parentID={match.params.issueID} />
                    </PermittedRender>
                </section>

                <section>
                    <Query query={getTasksForIssue} variables={{ parent: match.params.issueID }}>
                        {({ loading, error, data }: QueryResult) => {
                            if (loading) return <LoadingSpinner message='Loading tasks...' />
                            if (error) return <LoadingError error={error} />

                            if (!data.tasks || data.tasks.length === 0)
                                return <h4>No tasks.</h4>

                            return <TaskList
                                tasks={data.tasks}
                                linkBaseUrl={match.url.replace(/\/?tasks.+/g, '')}
                            />
                        }}
                    </Query>
                </section>
            </div>
        </div>
    );
}

export default graphql(getIssue, {
    name: 'qry_getIssue',
    options: ({ match }: InitialProps) => ({
        variables: {
            id: match.params.issueID
        }
    })
})(IssueView);
