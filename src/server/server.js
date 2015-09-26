'use strict';

import React         from 'react';
import express       from 'express';
import exphbs        from 'express-handlebars';
import http          from 'http';
import io            from 'socket.io';
import Router        from 'react-router';
import ServerManager from './scripts/managers/ServerManager';

import Routes        from '../shared/scripts/router/Routes';

let app           = express();
let server        = http.createServer(app);
let socket        = io(server);
let serverManager = new ServerManager(server, socket);

// Set handlebars as the templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'index', layoutsDir:__dirname + '/../views/layouts'}));
app.set('view engine', 'handlebars');

// Disable etag headers on responses
app.disable('etag');

app.set('views', __dirname + '/../views');

app.use('/', express.static(__dirname + '/../public/'));

app.get('/', function(req, res /*, next*/) {  
  Router.run(Routes, req.url, Handler => {
    let content = React.renderToString(<Handler />);
    res.render('game', { content: content });
  });
});


serverManager.listen();