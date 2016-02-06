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
    if(roomNumbers.length >= 9999) { alert('No more rooms available. Please come back later.'); return; }
    var roomNumber = ('0000' + Math.floor(Math.random()*10000)).slice(-4);
    while(roomNumbers.indexOf(roomNumber) != -1) {
      roomNumber = ('0000' + Math.floor(Math.random()*10000)).slice(-4);
    }
    roomNumbers.push(roomNumber);
    this.join(roomNumber);
    console.log('Joined', roomNumber);
    callback({roomNumber: roomNumber});
  },
  
  joinRoom: function(json, callback) {
    this.join(json.roomNumber);
    console.log('Joined', json.roomNumber);
    callback(json);
  },
  
  /**
   * Send message to a room.
   */
  message: function(json) {
    module.exports.io.to(json.roomNumber).emit('msg', json);
    console.log('Send message to', json.roomNumber);
  }

};

module.exports = function(io) {
  return new Rooms(io);
};
