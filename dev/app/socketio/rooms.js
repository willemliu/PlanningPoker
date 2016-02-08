/**
 * Rooms Socket IO connections
 */
var rooms = [];
var roomNumbers = [];
var instance = null;

var Rooms = function init(io) {
  console.log("Initialized Rooms Socket IO");
  module.exports.io = io;
};

Rooms.prototype = {

  /**
   * Create a random room with unique room number.
   */
  newRoom: function(json, callback) {
    var socket = this;
    if(roomNumbers.length >= 9999) { callback({roomNumber: null, msg: 'No more rooms available. Please try again later.'}); return; }
    var roomNumber = ('0000' + Math.floor(Math.random()*10000)).slice(-4);
    while(roomNumbers.indexOf(roomNumber) != -1) {
      roomNumber = ('0000' + Math.floor(Math.random()*10000)).slice(-4);
    }
    roomNumbers.push(roomNumber); // Add room number to array
    socket.join(roomNumber); // Let this socket join the room

    // Store the rooms and socket id associations
    if( rooms.some(function(val) { return val.roomNumber == roomNumber }) === false ) {
      rooms.push({roomNumber: roomNumber, socketIds: [socket.id]});
    } else {
      instance.joinRoom.call(socket);
    }
    
    console.log('==> New room', roomNumber);
    if(callback !== null) {
      callback({roomNumber: roomNumber, msg: 'New room opened ' + roomNumber});
    }
  },
  
  /**
   * Client joins a room.
   */
  joinRoom: function(json, callback) {
    var socket = this;
    instance.leaveRoom.apply(socket);
    socket.join(json.roomNumber);
    console.log('Joined room', json.roomNumber, 'by', socket.id);
    for(var idx in rooms) {
      // Prevent duplicate socket id insertion.
      if(rooms[idx].roomNumber == json.roomNumber && rooms[idx].socketIds.indexOf(socket.id) === -1) {
        rooms[idx].socketIds.push(socket.id);
        console.log('Room population', rooms[idx].socketIds.length);
      }
    }
    json.msg = 'Joined room ' + json.roomNumber;
    if(callback !== null) {
      callback(json);
    }
  },
  
  /**
   * Handle client disconnect.
   */
  leaveRoom: function() {
    var socket = this;
    // Remove socket id
    var roomNumber;
    var socketId = socket.id;

    if( rooms.some(function(val, idx, arr) { return val.socketIds.indexOf(socketId) != -1 }) ) {
      console.log('<== Leave room', socket.id);
      // Remove room number association with socket id
      for(var idx in rooms) {
        // We don't expect duplicate socket ids. But we will remove them if it exists.
        while(rooms[idx].socketIds.indexOf(socketId) != -1) {
          var removedSocket = rooms[idx].socketIds.splice(rooms[idx].socketIds.indexOf(socketId), 1);
          roomNumber = rooms[idx].roomNumber;
          console.log('Room', roomNumber, 'population', rooms[idx].socketIds.length, 'removed', removedSocket);
        }
        if(rooms[idx].socketIds.length === 0) {
          console.log('Cleanup empty room', roomNumber);
          rooms.splice(idx, 1);
        }
      }

      // Remove room only if room is empty.
      if( rooms.some(function(val) { return val.roomNumber == roomNumber; }) === false ) {
        console.log('Return key of room', roomNumber);
        roomNumbers.splice(roomNumbers.indexOf(roomNumber), 1);
      }
    }
    
    console.log('Active rooms', roomNumbers);
  },
  
  /**
   * Send message to a room.
   * {roomNumber: '0234', msg: 'Hi all!' }
   */
  message: function(json) {
    module.exports.io.to(json.roomNumber).emit('msg', json);
    console.log('Send message to', json.roomNumber);
  }

};

module.exports = function(io) {
  if(instance === null) {
    instance = new Rooms(io);
  }
  return instance;
};
