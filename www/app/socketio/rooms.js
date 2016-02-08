/**
 * Rooms Socket IO connections
 */
var rooms = [];
var roomNumbers = [];

var Rooms = function init(io) {
  console.log("Initialized Rooms Socket IO");
  module.exports.io = io;
};

Rooms.prototype = {

  /**
   * Create a random room with unique room number.
   */
  newRoom: function(json, callback) {
    if(roomNumbers.length >= 9999) { callback({roomNumber: null, msg: 'No more rooms available. Please try again later.'}); return; }
    var roomNumber = ('0000' + Math.floor(Math.random()*10000)).slice(-4);
    while(roomNumbers.indexOf(roomNumber) != -1) {
      roomNumber = ('0000' + Math.floor(Math.random()*10000)).slice(-4);
    }
    roomNumbers.push(roomNumber); // Add room number to array
    this.join(roomNumber); // Let this socket join the room

    // Store the rooms and socket id associations
    if( rooms.some(function(val) { return val.roomNumber == roomNumber }) === false ) {
      rooms.push({roomNumber: roomNumber, socketIds: [this.id]});
    } else {
      for(var idx in rooms) {
        if(rooms[idx].roomNumber == roomNumber && rooms[idx].socketIds.indexOf(socketId) === -1) {
          rooms[idx].socketIds.push(this.id);
        }
      }
    }
    
    console.log('==> New room', roomNumber);
    callback({roomNumber: roomNumber, msg: 'New room opened ' + roomNumber});
  },
  
  /**
   * Client joins a room.
   */
  joinRoom: function(json, callback) {
    this.join(json.roomNumber);
    console.log('Joined room', json.roomNumber);
    for(var idx in rooms) {
      if(rooms[idx].roomNumber == json.roomNumber && rooms[idx].socketIds.indexOf(this.id) === -1) {
        rooms[idx].socketIds.push(this.id);
      }
    }
    json.msg = 'Joined room ' + json.roomNumber;
    callback(json);
  },
  
  /**
   * Handle client disconnect.
   */
  leaveRoom: function() {
    console.log('<== User disconnected', this.id);
    // Remove socket id
    var roomNumber;
    var socketId = this.id;

    if( rooms.some(function(val, idx, arr) { return val.socketIds.indexOf(socketId) != -1 }) ) {
      // Remove room number association with socket id
      for(var idx in rooms) {
        while(rooms[idx].socketIds.indexOf(socketId) != -1) {
          rooms[idx].socketIds.splice(this.id, 1);
          roomNumber = rooms[idx].roomNumber;
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
  return new Rooms(io);
};
