import * as React from 'react';
import Order from 'src/types/Order';

// components
import MutableComment from 'src/containers/MutableComment';

interface Props {
    parentID: ID;
    comments: Comment[];
    orderByDate: Order;
}

export default ({ comments, parentID, orderByDate = Order.Descending }: Props): any => {
    if (orderByDate === Order.Descending) {
        // props are immutable references, have to clone to use mutable fn...
        comments = [...comments].reverse();
    }

    return comments.map(comment => (
        <MutableComment
            key={comment.id}
            comment={comment}
            parentID={parentID}
        />
    ));
}
