var port      = 3001;
var express   = require('express');
var app       = express();
var http      = require('http').Server(app);
var fs        = require('fs'); // bring in the file system api
var mustache  = require('mustache'); // bring in mustache template engine
var io        = require('socket.io')(http);
var house     = require('./app/socketio/house')(io);

require('./app/controllers/static')(app, express);
require('./app/controllers/home')(app, fs, mustache);

/**
 * Start the HTTP server
 */
http.listen(port, function(){
  console.log('listening on *:' + port);
});

