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
    var roomNumber = instance.findEmptyRoom();
    if(roomNumbers.length === null) {
      callback({roomNumber: null, msg: 'No more rooms available. Please try again later.'});
      return; 
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
      callback({roomNumber: roomNumber});
    }
  },

  /**
   * Return vacant room number.
   * Return null if all rooms are occupied.
   */
  findEmptyRoom: function() {
    var roomNumber = ('0000' + Math.floor(Math.random()*10000)).slice(-4);
    while(roomNumbers.indexOf(roomNumber) != -1) {
      // Check if all rooms are taken. If all rooms are taken then return null.
      if(roomNumbers.length >= 9999) {
        roomNumber = null;
        break;
      }
      roomNumber = ('0000' + Math.floor(Math.random()*10000)).slice(-4);
    }
    return roomNumber;
  },
  
  /**
   * Returns the room number for given socket.
   * Assumes a socket can only be in 1 room at any given time.
   */
  getRoomNumber: function() {
    var socket = this;
    console.log('Get room number', socket.id);
    for(var idx in rooms) {
      if(rooms[idx].socketIds.indexOf(socket.id) !== -1) {
        return rooms[idx].roomNumber;
      }
    }
    return null;
  },
  
  /**
   * Client joins an existing room.
   */
  joinRoom: function(json, callback) {
    var socket = this;
    // Check if room exists.
    if(roomNumbers.indexOf(json.roomNumber) === -1) {
      json.err = 'Room does not exist!';
      callback(json);
      return;
    }
    instance.leaveRoom.apply(socket);
    socket.join(json.roomNumber);
    json.socketId = socket.id;
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
    module.exports.io.to(json.roomNumber).emit('player joined', json);
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
          module.exports.io.to(roomNumber).emit('player left', { socketId: socketId });
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
  }

};

module.exports = function(io) {
  if(instance === null) {
    instance = new Rooms(io);
  }
  return instance;
};
