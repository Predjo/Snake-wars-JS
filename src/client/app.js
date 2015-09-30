'use strict';

import React                from 'react';
import ReactDOM             from 'react-dom';
import Router               from 'react-router';
import Routes               from '../shared/scripts/router/ClientRoutes';
import createBrowserHistory from 'history/lib/createBrowserHistory'

let history = createBrowserHistory();
ReactDOM.render(<Router history={history}>{Routes}</Router>, document.getElementById('react-app'));