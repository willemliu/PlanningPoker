/**
 * Cards handler
 */
define([
  'jquery'
], function($) {
  var instance = null;
  
  function Cards(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one Cards, use Cards.getInstance()");
    }
  }

  Cards.prototype = {
    init: function() {
      console.log('Initialize Cards');
      $(document).on('click', '.poker-cards .card', $.proxy(this.selectCard, this));
    },
    
    resetSelection: function() {
      $('.poker-cards .selected').removeClass('selected');
    },
    
    selectCard: function(e) {
      this.resetSelection();
      $(e.currentTarget).toggleClass('selected');
      SOCKET.emit('select card', { card: e.currentTarget.classList[1] });
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new Cards();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new Cards();

});