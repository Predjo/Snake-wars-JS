'use strict';

import React                    from 'react';
import express                  from 'express';
import exphbs                   from 'express-handlebars';
import http                     from 'http';
import io                       from 'socket.io';
import {RoutingContext, match } from 'react-router';
import ServerManager            from './scripts/managers/ServerManager';
import createLocation           from 'history/lib/createLocation';
import { renderToString }       from 'react-dom/server';

import Routes                   from '../shared/scripts/router/ServerRoutes';

let app           = express();
let server        = http.createServer(app);
let socket        = io(server);
let serverManager = new ServerManager(server, socket);

let feRoute = function(req, res) {
  let location = createLocation(req.url);

  match({ routes: Routes , location }, (error, redirectLocation, renderProps) => {
    if (redirectLocation)
      res.redirect(301, redirectLocation.pathname + redirectLocation.search)
    else if (error)
      res.status(500).send(error.message);
    else if (renderProps == null)
      res.status(404).send('Not found');
    else
      res.render('game', { content: renderToString(<RoutingContext {...renderProps}/>) });
  })
}

// Set handlebars as the templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'index', layoutsDir:__dirname + '/../views/layouts'}));
app.set('view engine', 'handlebars');

// Disable etag headers on responses
app.disable('etag');

app.set('views', __dirname + '/../views');

app.use('/', express.static(__dirname + '/../public/'));

app.get('/', (req, res, next) => {  
  feRoute(req, res, next);
});

app.get('/game', (req, res, next) => {  
  feRoute(req, res, next);
});


serverManager.listen();