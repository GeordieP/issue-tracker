import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';

interface Props extends HTMLAttributes<HTMLFormElement> {
    onSubmit: FormEventHandler;
    props?: any[];
}

export default ({ onSubmit, ...props }: Props) => (
    <form className="flex-h" onSubmit={onSubmit} {...props}>
        <input type="email" id="email" name="email" placeholder="Email" />
        <input type="password" id="password" name="password" placeholder="Password" />
        <button type="submit" className="Button Button--primary">Login</button>
    </form>
);
