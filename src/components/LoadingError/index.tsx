import * as React from 'react';

interface Props {
    error: string | Error;
}

export default ({ error }: Props) => (
    <div>
        <p>Error:</p>
        <p>
            { error instanceof Error
                ? error.message
                : error
            }
        </p>
    </div>
);
