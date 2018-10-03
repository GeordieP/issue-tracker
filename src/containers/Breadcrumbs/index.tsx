import * as React from 'react';
import { HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { Query, QueryResult } from 'react-apollo';
import gql from 'graphql-tag';
import * as classnames from 'classnames';

import './Breadcrumbs.css';

const MAX_CRUMB_LENGTH = 40;
const REGEX_URL_SEGMENT = /(\w+)\/(\w+)/g;

// keys in this object correspond to segments of current page URL, eg:
// --------v-------------------v---------------v------------
// url.com/projects/:projectID/issues/:issueID/tasks/:taskID
// url.com/projects/5b3fac7702/issues/5b3fac8e/tasks/5b44e5d
// a segment key is matched along with its corresponding resource ID by REGEX_URL_SEGMENT
//
// `query` is the query to run,
// `typeKey` and `nameKey` are used to extract the correct data for a
// given resource type out of the `data` object passed from the Query component to
// the crumb element we're rendering.
const paramTypeHandlers = Object.freeze({
    'projectDetails': {
        typeKey: 'project',
        nameKey: 'name',
        query: gql(`
            query GetProject($id: ID!) {
                project(id: $id) { id name }
            }
        `),
    },
    'projects': {
        typeKey: 'project',
        nameKey: 'name',
        query: gql(`
            query GetProject($id: ID!) {
                project(id: $id) { id name }
            }
        `),
    },
    'issues': {
        typeKey: 'issue',
        nameKey: 'title',
        query: gql(`
            query GetIssue($id: ID!) {
                issue(id: $id) { id title }
            }
        `),
    },
    'tasks': {
        typeKey: 'task',
        nameKey: 'title',
        query: gql(`
            query GetTask($id: ID!) {
                task(id: $id) { id title }
            }
        `),
    },
});

const CreateListItems = ({ pathname }: { pathname: string }): any[] | null => {
    const items: any[] = [];
    let match = REGEX_URL_SEGMENT.exec(pathname);

    while (match != null) {
        const param = match[1];
        const id = match[2];

        if (!param) throw new Error("Breadcrumbs: no param");
        if (!id) throw new Error("Breadcrumbs: no id");
        if (!paramTypeHandlers[param]) throw new Error(`No breadcrumb handler for route ${param}`)

        // set up the query and required data keys for the current object type, based on our current url param
        const { query, typeKey, nameKey } = paramTypeHandlers[param];

        // link should be the current link excluding everything after the clicked object's ID
        const linkMatches: RegExpMatchArray | null = pathname.match(new RegExp('.+' + id, 'g'));

        if (linkMatches == null) {
            return null;
        }

        const linkPath = linkMatches[0];

        // query a friendly name to show in the crumb for the given resource.
        // most of the time, the query result should be served by the apollo cache and the
        // query should't ever reach the network.
        items.push(<Query key={id} query={query} variables={{ id }}>
            {({ loading, error, data }: QueryResult) => {
                if (loading) return (<span>...</span>);
                if (error) {
                    console.error(error);
                    return (<span>[ERROR]</span>);
                }

                // truncate name if it's too long
                let name: string = data[typeKey][nameKey].toUpperCase();
                if (name.length > MAX_CRUMB_LENGTH) {
                    name = name.substring(0, MAX_CRUMB_LENGTH - 3) + '...';
                }

                // use type and name keys for current param type to extract relevant data from returned object
                return <Crumb
                    key={id}
                    id={`breadcrumb_${id}`}
                    name={name}
                    linkPath={linkPath}
                />
            }}
        </Query>);

        match = REGEX_URL_SEGMENT.exec(pathname);
    }

    return items;
}

interface CrumbProps extends HTMLAttributes<HTMLElement> {
    linkPath: string;
    name: string;
    renderNext?: boolean;
    props?: any[];
}

const Crumb = ({ linkPath, name, renderNext = true, ...props }: CrumbProps) => (
    <li className='Breadcrumbs-crumb' {...props}>
        <Link to={linkPath}>{ name }</Link>
    </li>
);

// takes a react-router match prop
export default ({ location }: { location: any }) => (
    <ul id='breadcrumbs' className={classnames('Breadcrumbs u-fullHeight u-fullWidth u-flexH u-centerCrossAxis')}>
        { CreateListItems(location) }
    </ul>
);
