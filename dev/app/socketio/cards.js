/**
 * Cards Socket IO connections
 */
var instance = null;

var Cards = function init(io) {
  console.log("Initialized Cards Socket IO");
  module.exports.io = io;
};

Cards.prototype = {
  /**
   * Select card.
   * {card: 3, roomNumber: '0345'}
   */
  selectCard: function(json) {
    var socket = this;
    console.log('Select card', json.card, json.roomNumber, socket.id);
    module.exports.io.to(json.roomNumber).emit('select card', json);
  },
  
  /**
   * Reshuffle cards. Effectively resets the game for every player in the room.
   */
  reshuffle: function(json) {
    var socket = this;
    console.log('Reshuffle card for room', json.roomNumber, socket.id);
    module.exports.io.to(json.roomNumber).emit('reshuffle', json);
  }
};

module.exports = function(io) {
  if(instance === null) {
    instance = new Cards(io);
  }
  return instance;
};
