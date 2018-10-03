import * as React from 'react';

interface Props {
    message?: string;
}

export default ({ message = 'Loading...' }: Props) => (
    <p>{ message }</p>
);
