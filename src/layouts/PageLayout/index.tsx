import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

// slot components
import NavBar from 'src/containers/NavBar';
import QueriedProjectList from 'src/containers/QueriedProjectList';
import LoginView from 'src/views/LoginView';
import ProjectView from 'src/views/ProjectView';
import SignupView from 'src/views/SignupView';
import ProjectCreateView from 'src/views/ProjectCreateView';
import IssueCreateView from 'src/views/IssueCreateView';
import UnauthorizedView from 'src/views/UnauthorizedView';

// styles
import './PageLayout.css';

export default () => (
    <div className="Layout Layout--page u-flexV u-centerMainAxis">
        <div className="Layout-Navbar">
            {/* render a route for any page that should have special things rendered by the navbar component */}
            <Switch>
                <Route path='/projects/:projectID' component={NavBar} />
                <Route component={NavBar} />
            </Switch>
        </div>

        <div className="Layout-Content">
            <Switch>
                <Route path='/' exact={true} component={QueriedProjectList} />
                <Route path='/newProject' exact={true} component={ProjectCreateView} />
                <Route path='/projects' exact={true} component={QueriedProjectList} />
                <Route path='/projects/:projectID/newIssue' exact={true} component={IssueCreateView} />
                <Route path='/projectDetails/:projectID' exact={true} component={ProjectView} />
                <Route path='/login' component={LoginView} />
                <Route path='/signup' component={SignupView} />
                <Route path='/401' component={UnauthorizedView} />
            </Switch>
        </div>
    </div>
);
