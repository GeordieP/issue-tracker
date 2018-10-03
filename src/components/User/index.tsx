import * as React from 'react';
import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
    user: User;
    props?: any[];
}

export default ({ user, ...props }: Props) => (
    <div {...props}>
        <p>Username: { user.username }</p>
        <p>Email: { user.email }</p>
        <p>Full Name: { user.fullName }</p>
        <p>Bio: { user.bio }</p>
    </div>
);
