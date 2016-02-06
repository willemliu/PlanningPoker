var port      = 3001;
var express   = require('express');
var app       = express();
var http      = require('http').Server(app);
var fs        = require('fs'); // bring in the file system api
var mustache  = require('mustache'); // bring in mustache template engine
var io        = require('socket.io')(http);
var rooms     = require('./app/socketio/rooms')(io);

io.on('connection', function(socket) {
  console.log('User connected to SocketIO', socket.id);
  socket.on('newRoom', rooms.newRoom);
  socket.on('joinRoom', rooms.joinRoom);
  socket.on('msg', rooms.message);

  socket.on('disconnect', function() {
    console.log('User disconnected', socket.id);
  });
});

require('./app/controllers/static')(app, express);
require('./app/controllers/home')(app, fs, mustache);

/**
 * Start the HTTP server
 */
http.listen(port, function(){
  console.log('listening on *:' + port);
});

