import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';
import * as classnames from 'classnames';

interface Props extends HTMLAttributes<HTMLFormElement> {
    onSubmit: FormEventHandler;
    props?: any[];
}

export default ({ onSubmit, className, ...props }: Props) => (
    <form className={classnames('flex-v', className)} onSubmit={onSubmit} {...props}>
        <section>
            <h2>Name</h2>
            <input type="text" name="name" placeholder="Name" />

            <h2>Project Alias</h2>
            <input type="text" name="alias" placeholder="Alias" />
        </section>

        <section>
            <button type="submit" className="Button Button--primary">Save</button>
        </section>
    </form>
);
