import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import PageLayout from 'src/layouts/PageLayout';
import SplitLayout from 'src/layouts/SplitLayout';
import FirstIssueRedirect from 'src/containers/FirstIssueRedirect';
import 'src/styles/layout.css';

export default () => (
    <div className='App'>
        <Switch>
            <Route path='/projectDetails/:projectID' exact={true} component={PageLayout} />
            <Route path='/projects/:projectID/issues' exact={true} component={FirstIssueRedirect} />
            <Route path='/projects/:projectID' exact={true} component={FirstIssueRedirect} />
            <Route path='/projects/:projectID/newIssue' exact={true} component={PageLayout} />
            <Route path='/projects/:projectID' component={SplitLayout} />
            <Route path='/' component={PageLayout} />
        </Switch>
    </div>
);
