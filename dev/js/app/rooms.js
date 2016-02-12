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
      var room = this;
      $(document).on('click', '#newRoom', $.proxy(room.newRoom, room));
      $(document).on('click', '#joinRoom', $.proxy(room.joinRoom, room));
      $(document).on('keyup', '#roomNumber, #name', function(e) {
        // Enter key
        if(e.which === 13) {
          e.preventDefault();
          room.joinRoom();
        }
      });
    },
        
    /**
     * Create a new room.
     */
    newRoom: function() {
      SOCKET.emit('newRoom', null, function(json) {
        roomNumber = json.roomNumber;
        $('#roomNumber').val(roomNumber);
        $('.room-number').text(json.roomNumber);
      });
    },
    
    /**
     * Join an existing room.
     */
    joinRoom: function() {
      if($('#roomNumber').val().length !== 4) $(EVENT_BUS).trigger('PlanningPoker.room:joinRoom:error', $('#roomNumber'));
      if($('#name').val().length === 0) $(EVENT_BUS).trigger('PlanningPoker.room:joinRoom:error', $('#name'));
      if($('#roomNumber').val().length !== 4 || $('#name').val().length === 0) {
        return;
      }
      SOCKET.emit('joinRoom', { 
        name: $('#name').val(), 
        roomNumber: $('#roomNumber').val() 
      }, function(json) {
        roomNumber = json.roomNumber;
        if(typeof(json.msg) != 'undefined') {
          $(EVENT_BUS).trigger('PlanningPoker.room:joinRoom:joined', [$('.join-room'), json]);
          $('.username').text(json.name);
        } else {
          $(EVENT_BUS).trigger('PlanningPoker.room:joinRoom:error', $('#roomNumber'));
        }
      });
    },
    
    /**
     * Process message said in a room.
     */
    processMsg: function(json) {
      console.log(JSON.stringify(json));
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
