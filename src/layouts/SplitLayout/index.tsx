import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

// slot components
import NavBar from 'src/containers/NavBar';
import IssueListView from 'src/views/IssueListView';
import IssueView from 'src/views/IssueView';
import TaskView from 'src/views/TaskView';

export default () => (
    <div className="Layout Layout--split">
        <div className="Layout-Navbar">
            {/* render a route for any page that should have special things rendered by the navbar component */}
            <Switch>
                <Route path='/projects/:projectID/issues/:issueID' exact={true} component={NavBar} />
                <Route path='/projects/:projectID/issues/:issueID/tasks/:taskID' component={NavBar} />
                <Route component={NavBar} />
            </Switch>
        </div>

        <div className="Layout-Sidebar">
            <Switch>
                <Route path='/projects/:projectID/issues/:issueID' component={IssueListView} />
            </Switch>
        </div>

        <div className="Layout-Content">
            <Switch>
                <Route path='/projects/:projectID/issues/:issueID' exact={true} component={IssueView} />
                <Route path='/projects/:pojectID/issues/:issueID/tasks/:taskID' component={TaskView} />
            </Switch>
        </div>
    </div>
);
