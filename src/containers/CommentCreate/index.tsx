import * as React from 'react';
import { HTMLAttributes } from 'react';
import { Mutation } from 'react-apollo';
import { createComment } from 'src/util/graphql/mutations';
import { getComments } from 'src/util/graphql/queries';
import { submitFormMutation } from 'src/util/formSubmission';
import CommentCreateForm from 'src/components/CommentCreateForm';

interface Props extends HTMLAttributes<HTMLFormElement> {
    parentID: ID;
    parentType: CommentParentType;
    props?: any[];
}

export default ({ parentID, parentType, ...props }: Props) => (
    <Mutation
        mutation={createComment}
        refetchQueries={[{
            query: getComments,
            variables: { parent: parentID }
        }]}>
        { (mutate: any) =>
            <CommentCreateForm
                parentID={parentID}
                parentType={parentType}
                onSubmit={submitFormMutation(mutate)}
                {...props}
            />
        }
    </Mutation>
);
