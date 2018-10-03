import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';

interface Props extends HTMLAttributes<HTMLFormElement> {
    onSubmit: FormEventHandler;
    props?: any[];
}

export default ({ onSubmit, ...props }: Props) => (
    <form className="flex-v" onSubmit={onSubmit} {...props}>
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <input type="email" name="email" placeholder="Email" />
        <input type="text" name="fullName" placeholder="Full Name" />

        <button type="submit" className="Button Button--primary">Sign Up</button>
    </form>
);
