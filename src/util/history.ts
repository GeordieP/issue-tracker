import createBrowserHistory from 'history/createBrowserHistory';

// create the history object and export it.
// this way, this history module acts like a singleton; any components that import this have
// access to the same history object and can act on it.
// although this is generally bad practice, it's the easiest way to redirect the user from within
// components that otherwise don't have access to the router state or history.

export default createBrowserHistory();
