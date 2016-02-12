/**
 * House Socket IO connections
 * Handles all incoming socket events and passes it to their handlers.
 */
var rooms;
var cards;

var instance = null;

var House = function init(io) {
  rooms     = require('./rooms')(io);
  cards     = require('./cards')(io);
  console.log("Initialized House Socket IO");
  module.exports.io = io;
  module.exports.io.on('connection', function(socket) {
    console.log('User connected to SocketIO', socket.id);
    socket.on('newRoom', rooms.newRoom);
    socket.on('joinRoom', rooms.joinRoom);
    socket.on('select card', instance.selectCard);
    socket.on('show cards', instance.showCards);
    socket.on('reshuffle', instance.reshuffle);

    socket.on('disconnect', rooms.leaveRoom);
  });
};

House.prototype = {
  
  
  showCards: function(json) {
    var socket = this;
    json.roomNumber = rooms.getRoomNumber.apply(socket);
    module.exports.io.to(json.roomNumber).emit('show cards', json);
  },
  
  selectCard: function(json) {
    var socket = this;
    json.roomNumber = rooms.getRoomNumber.apply(socket);
    json.socketId = socket.id;
    cards.selectCard.apply(socket, [json]);
  },
  
  reshuffle: function() {
    var socket = this;
    var json = {
      roomNumber: rooms.getRoomNumber.apply(socket)
    };
    cards.reshuffle.apply(socket, [json]);
  }
  
};

module.exports = function(io) {
  if(instance === null) {
    instance = new House(io);
  }
  return instance;
};
