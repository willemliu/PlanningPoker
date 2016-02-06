/**
 * Rooms
 */
define([
  'jquery',
  'socketio'
], function($, io) {
  var instance = null;
  var socket = io();
  var roomNumber;
  
  function Rooms(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one Rooms, use Rooms.getInstance()");
    }
  }

  Rooms.prototype = {
    init: function() {
      console.log('Initialize Rooms');
      
      socket.on('msg', $.proxy(this.processMsg, this));
      
      this.addListeners();
    },
    
    addListeners: function() {
      $('#newRoom').on('click', $.proxy(this.newRoom, this));
      $('#joinRoom').on('click', $.proxy(this.joinRoom, this));
      $('#msg').on('click', $.proxy(this.msg, this));
    },
        
    /**
     * Create a new room.
     */
    newRoom: function() {
      socket.emit('newRoom', null, function(json) {
        roomNumber = json.roomNumber;
        $('#roomNumber').val(roomNumber);
      });
    },
    
    joinRoom: function() {
      socket.emit('joinRoom', { roomNumber: $('#roomNumber').val() }, function(json) {
        roomNumber = json.roomNumber;
      });
    },
    
    /**
     * Process message said in a room.
     */
    processMsg: function(json) {
      console.log(JSON.stringify(json));
    },
    
    /**
     * msg
     */
    msg: function() {
      socket.emit('msg', {roomNumber: roomNumber, msg: 'ladieda'});
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new Rooms();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new Rooms();
});