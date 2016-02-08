/**
 * Rooms
 */
define([
  'jquery'
], function($) {
  var instance = null;
  var roomNumber;
  
  function Rooms(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one Rooms, use Rooms.getInstance()");
    }
  }

  Rooms.prototype = {
    init: function() {
      console.log('Initialize Rooms');
            
      this.addListeners();
    },
    
    addListeners: function() {
      SOCKET.on('msg', $.proxy(this.processMsg, this));
      $('#newRoom').on('click', $.proxy(this.newRoom, this));
      $('#joinRoom').on('click', $.proxy(this.joinRoom, this));
      $('#msg').on('click', $.proxy(this.msg, this));
    },
        
    /**
     * Create a new room.
     */
    newRoom: function() {
      SOCKET.emit('newRoom', null, function(json) {
        roomNumber = json.roomNumber;
        $('#roomNumber').val(roomNumber);
        if(typeof(json.msg) != 'undefined') {
          console.log(json.msg);
        }
      });
    },
    
    joinRoom: function() {
      if($('#roomNumber').val().length !== 4 || $('#name').val().length === 0) {
        $(EVENT_BUS).trigger('PlanningPoker.joinRoom:error', $('.join-room'));
        return;
      }
      SOCKET.emit('joinRoom', { roomNumber: $('#roomNumber').val() }, function(json) {
        roomNumber = json.roomNumber;
        if(typeof(json.msg) != 'undefined') {
          $(EVENT_BUS).trigger('PlanningPoker.joinRoom:joined', [$('.join-room'), json]);
        }
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
      SOCKET.emit('msg', {roomNumber: roomNumber, msg: 'ladieda'});
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
