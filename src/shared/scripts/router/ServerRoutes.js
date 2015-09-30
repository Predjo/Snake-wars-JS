'use strict';

import { Route, IndexRoute } from 'react-router';  
import React from 'react';

import App from '../components/App';
import Login from '../components/Login';

export default (
  <Route component={ App } path='/' >
    <IndexRoute component={ Login } />
  </Route>
);