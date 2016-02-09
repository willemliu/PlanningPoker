/**
 * SocketConfig configures the socket.io bindings
 */
define([
  'jquery',
  'app/players',
  'app/rooms'
], function($, Players, Rooms) {
  var instance = null;
  
  function SocketConfig(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one Players, use Players.getInstance()");
    }
  }

  SocketConfig.prototype = {
    init: function() {
      console.log('Initialize SocketConfig');
      SOCKET.on('player joined', $.proxy(Players.getInstance().receivePlayers, Players.getInstance()));
      SOCKET.on('player left', $.proxy(Players.getInstance().removePlayer, Players.getInstance()));
      SOCKET.on('msg', $.proxy(Rooms.getInstance().processMsg, Rooms.getInstance()));
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new SocketConfig();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new SocketConfig();

});