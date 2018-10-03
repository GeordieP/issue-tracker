import * as React from 'react';
import { HTMLAttributes } from 'react';
import { Mutation } from 'react-apollo';
import { getTasksForIssue } from 'src/util/graphql/queries';
import { createTask } from 'src/util/graphql/mutations';
import { submitFormMutation } from 'src/util/formSubmission';

// components
import TaskCreateForm from 'src/components/TaskCreateForm';

interface Props extends HTMLAttributes<HTMLFormElement> {
    parentID: ID;
    props?: any[];
}

export default ({ parentID, ...props }: Props) => (
    <Mutation
        mutation={createTask}
        refetchQueries={[{
            query: getTasksForIssue,
            variables: { parent: parentID }
        }]}>
        { (createFn: any) =>
            <TaskCreateForm
                parentID={parentID}
                onSubmit={submitFormMutation(createFn)}
                {...props}
            />
        }
    </Mutation>
);
