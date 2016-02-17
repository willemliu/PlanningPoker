/**
 * Message sender
 */
define([
  'jquery'
], function($) {
  var instance = null;
  
  function Message(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one Message, use Message.getInstance()");
    }
  }

  Message.prototype = {
    init: function() {
      var message = this;
      console.log('Initialize Message');
      $(document).on('change', '#message', function() {
        SOCKET.emit('message', {message: $(this).val()});
        $(this).val('');
      });
    },
    
    /**
     * Show message
     */
    receivedMessage: function(json) {
      var messageEl = $('.room .players .player[data-socket-id="' + json.socketId + '"] .message');
      messageEl.text(json.message);
      messageEl.addClass('show-message');
      $('.room .players .player[data-socket-id="' + json.socketId + '"] .show-message').one('animationend	animationend	webkitAnimationEnd	oanimationend	MSAnimationEnd', function() {
        $(this).hide();
        $(this).removeClass('show-message');
      });

    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new Message();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new Message();

});