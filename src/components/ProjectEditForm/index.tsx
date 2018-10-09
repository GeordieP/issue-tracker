import * as React from 'react';
import { HTMLAttributes, FormEventHandler } from 'react';

interface Props extends HTMLAttributes<HTMLFormElement> {
    project: Project;
    onSubmit: FormEventHandler;
    props?: any[];
}

export default ({ project, onSubmit, ...props }: Props) => (
    <form onSubmit={onSubmit} {...props}>
        <input
            type="text"
            data-testid="editProject_projectID"
            name="id"
            value={project.id}
            readOnly={true} hidden={true} disabled={true}
        />

        <section>
            <h2>Name</h2>
            <input
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={project.name}
            />

            <h2>Project Alias</h2>
            <input
                type="text"
                name="alias"
                placeholder="Alias"
                defaultValue={project.alias}
            />
        </section>

        <section>
            <button type="submit" className="Button Button--save">Save</button>
        </section>
    </form>
);
