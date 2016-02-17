/**
 * SocketConfig configures the socket.io bindings
 * Bind socket events to their handlers.
 */
define([
  'jquery',
  'app/cards',
  'app/message',
  'app/players',
  'app/rooms'
], function($, Cards, Message, Players, Rooms) {
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
      SOCKET.on('message', $.proxy(Message.getInstance().receivedMessage, Message.getInstance()));
      SOCKET.on('select card', $.proxy(Cards.getInstance().playerSelectedCard, Cards.getInstance()));
      SOCKET.on('show cards', $.proxy(Cards.getInstance().showCards, Cards.getInstance()));
      SOCKET.on('reveal cards', $.proxy(Cards.getInstance().revealCards, Cards.getInstance()));
      SOCKET.on('reshuffle', $.proxy(Cards.getInstance().hideCards, Cards.getInstance()));
      SOCKET.on('host left', function() {
        if(IS_APP) {
          navigator.vibrate(200);
          navigator.notification.confirm(
            'Host has left',  // message
            function() {
              window.location = START_PAGE;
            },              // callback to invoke with index of button pressed
            'Exit game',            // title
            'Ok'             // buttonLabels
          );
          
        } else {
          alert('Host has left');
          window.location = START_PAGE;
        }
      });
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