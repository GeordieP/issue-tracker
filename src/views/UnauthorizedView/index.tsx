import * as React from 'react';
import { Link } from 'react-router-dom';

export default () => (
    <div className='u-flexV u-centerH'>
        <div>
            <h1>Unauthorized</h1>
            <h3>You don't have permission to view this page.</h3>

            <Link to='/'>> Back To Home</Link>
        </div>
    </div>
);
