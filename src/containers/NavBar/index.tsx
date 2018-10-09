import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Query, QueryResult, ApolloConsumer } from 'react-apollo';
import { authStatus } from 'src/util/graphql/clientQueries';
import history from 'src/util/history';
import * as classnames from 'classnames';
import { Home as HomeIcon, LogOut as LogoutIcon } from 'react-feather';

import NavRoutes from './NavRoutes';

// styles
import './NavBar.css';

interface Props {
    className?: string;
}

class NavBar extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <nav className={classnames('NavBar u-fullWidth u-fullHeight', this.props.className)}>
                <ul className="u-flexH NavBar-itemList">
                    <Link to='/projects' title='Home'>
                        <li className='u-flexV u-centerBoth circle'>
                            <HomeIcon />
                        </li>
                    </Link>
                </ul>

                <ul className="u-flexH NavBar-itemList">
                    <NavRoutes />

                    <Query query={ authStatus }>
                        {({ loading, error, data }: QueryResult) => {
                            if (loading) return (<p>loading...</p>);
                            if (error) return (<p>Error!</p>);

                            return (data.auth_authenticated)
                                ? this.renderLoggedInButtons(data.auth_username)
                                : this.renderLoggedOutButtons()
                        }}
                    </Query>
                </ul>
            </nav>
        );
    }

    private renderLoggedInButtons = (username: string) => (
        <LogoutBtn username={username} />
    );

    private renderLoggedOutButtons = () => (
        <React.Fragment>
            <Link id='signup' to='/signup' title='Sign Up'>
                <div>Sign Up</div>
            </Link>

            <Link id='login' to='/login' title='Log In'>
                <div>Log In</div>
            </Link>
        </React.Fragment>
    );
}

// once the logout finishes, we need to reset data in the apollo cache.
const logoutRequest = (client: any) => axios('/auth/logout')
    .then((res: any) => {
        if (res.status === 200) history.push('/');
        client.writeData({ data: {
            auth_authenticated: false
        }});
    })
    .catch(console.error);

// bind the apollo client to the logout request function
const LogoutBtn = ({ username, children }: any) => (
    <ApolloConsumer>
        { (client: any) => (
            <Link to='/' onClick={logoutRequest.bind(null, client)}>
                <li id='logout' className='u-flexV u-centerBoth circle' title={`Logged in as ${username}`}>
                    <LogoutIcon />
                </li>
            </Link>
        )}
    </ApolloConsumer>
);

export default NavBar;
