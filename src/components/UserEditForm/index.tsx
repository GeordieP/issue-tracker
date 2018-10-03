import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';
import * as classnames from 'classnames';

interface Props extends HTMLAttributes<HTMLFormElement> {
    user: User;
    onSubmit: FormEventHandler;
    props?: any[];
}

export default ({ user, onSubmit, className, ...props }: Props) => (
    <form onSubmit={onSubmit} className={classnames("flex-h", className)} {...props}>
        <input
            type="text"
            name="id"
            data-testid='editUser_userID'
            value={user.id}
            readOnly={true} hidden={true} disabled={true}
        />
        <input
            type="text"
            name="username"
            defaultValue={user.username}
            placeholder="Username"
        />
        <input
            type="email"
            name="email"
            defaultValue={user.email}
            placeholder="Email"
        />
        <input
            type="text"
            name="fullName"
            defaultValue={user.fullName}
            placeholder="Full Name"
        />

        <input type="text"
            name="bio"
            defaultValue={user.bio}
            placeholder="Bio"
        />

        <button type="submit" className="Button Button--primary">Save</button>
    </form>
);
