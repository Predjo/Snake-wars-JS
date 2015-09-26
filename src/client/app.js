'use strict';

import React from 'react';
import Router from 'react-router';
import Routes from '../shared/scripts/router/Routes';

Router.run(Routes, Router.HistoryLocation, (Handler/*, state*/) => {
  React.render(<Handler />, document.body);
});