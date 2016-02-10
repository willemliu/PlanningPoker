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
      $('#reshuffle').on('click', $.proxy(this.reshuffle, this));
    },
    
    reshuffle: function() {
      if(confirm('Reset the game?')) {
        SOCKET.emit('reshuffle');
      }
    },
    
    resetSelection: function() {
      $('.poker-cards .selected').removeClass('selected');
    },
    
    selectCard: function(e) {
      // Only allow selection changes when cards are not opened.
      if($('html:not(.cards-opened)').length === 1) {
        this.resetSelection();
        $(e.currentTarget).toggleClass('selected');
        SOCKET.emit('select card', { card: $(e.currentTarget).data('value') });
      }
    },
    
    playerSelectedCard: function(json) {
      $('.room .players .player[data-socket-id="' + json.socketId + '"] .card.no-value').removeClass('no-value');
      // Set the value for the player if card is not shown yet.
      $('.room .players .player[data-socket-id="' + json.socketId + '"] .card:not(.show-value) .value').text(json.card);
      // Show cards when all players selected their cards.
      if($('.card.no-value').length === 0) {
        this.showCards();
      }
    },
    
    showCards: function() {
      $('html').addClass('cards-opened');
      $('.room .players .player .card').addClass('show-value');
      $(EVENT_BUS).trigger('PlanningPoker.cards:showCards:done');
    },
    
    /**
     * Hide cards again. Effectively resets the game for the player.
     */
    hideCards: function() {
      $('html').removeClass('cards-opened');
      $('.room .players .player .card').removeClass('show-value').addClass('no-value');
      $('.seat .poker-cards .selected').removeClass('selected');
      $('.room .players .player .card .value').empty();
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