/**
 * Players hospitality
 */
define([
  'jquery',
  'mustache'
], function($, Mustache) {
  var instance = null;
  
  function Players(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one Players, use Players.getInstance()");
    }
  }

  Players.prototype = {
    init: function() {
      console.log('Initialize Players');
    },
    
    /**
     * Receive the player into the room.
     */
    receivePlayers: function(json) {
      console.log('player joined', json);
      $.get('/templates/player.html', function(template) {
        var rendered = Mustache.render(template, json);
        // Remove the player first if player already is in the room
        $('[data-socket-id="' + json.socketId + '"]').remove();
        // Add the player
        $('.players').append(rendered);
      });
    },
    
    /**
     * Remove the player from the room.
     */
    removePlayer: function(json) {
      console.log('player left', json);
      $('[data-socket-id="' + json.socketId + '"]').remove();
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new Players();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new Players();

});