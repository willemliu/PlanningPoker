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
      $(document).on('click', '#reshuffle', $.proxy(this.reshuffle, this));
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
      $('.room .players .player[data-socket-id="' + json.socketId + '"] .card:not(.show-value)').attr('data-value', json.card);
      // Only host shows cards when all players selected their cards.
      if($('html.host').length > 0 && $('.card.no-value').length === 0) {
        SOCKET.emit('show cards', {highestOccurrence: this.getHighestOccurrence()});
      }
    },
    
    getHighestOccurrence: function() {
      var cards = $('.room .players .player .card');
      var modeMap = {};
      var maxCard = [], maxCount = 1;
      cards.each(function() {
        var cardVal = $(this).attr('data-value');
        if(typeof(modeMap[cardVal]) == 'undefined') {
          modeMap[cardVal] = 1;
        } else {
          modeMap[cardVal]++;          
        }
        if(modeMap[cardVal] > maxCount)
        {
          maxCard = [cardVal];
          maxCount = modeMap[cardVal];
        } else if(modeMap[cardVal] === maxCount) {
          maxCard.push(cardVal);
        }
      });
      return maxCard;
    },
    
    showHighestOccurrence: function(maxCard) {
      // Highlight all cards of highest occurrence. Even the cards in the hand of the players.
      for(var idx in maxCard) {
        $('.card[data-value="' + maxCard[idx] + '"]').addClass('highlight');
      }
    },
    
    showCards: function(json) {
      $('html').addClass('cards-opened');
      $('.room .players .player .card').addClass('show-value');
      $(EVENT_BUS).trigger('PlanningPoker.cards:showCards:done');
      this.showHighestOccurrence(json.highestOccurrence);
    },
    
    /**
     * Hide cards again. Effectively resets the game for the player.
     */
    hideCards: function() {
      $('html').removeClass('cards-opened');
      $('.card').removeClass('highlight');
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