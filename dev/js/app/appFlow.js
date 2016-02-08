/**
 * AppFlow regulates the flow of the application
 */
define([
  'jquery'
], function($) {
  var instance = null;
  var screens = ['.new-room', '.join-room', 'poker-cards', 'room'];
  
  function AppFlow(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one AppFlow, use AppFlow.getInstance()");
    }
  }

  AppFlow.prototype = {
    init: function() {
      console.log('Initialize AppFlow');
      $(document).on('click', '#newRoom', this.showNewRoom);
      $(EVENT_BUS).on('PlanningPoker.joinRoom:error', this.shakeGuest);
      $(EVENT_BUS).on('PlanningPoker.joinRoom:joined', this.showCards);
    },
    
    /**
     * Shake guest because not all requirements are met.
     */
    shakeGuest: function(e, el) {
      el = $(el);
      el.addClass('shake');
      el.one('animationend	animationend	webkitAnimationEnd	oanimationend	MSAnimationEnd', function() {
        el.removeClass('shake');
      });
    },
    
    showNewRoom: function() {
      $('.new-room').addClass('blink');
      $('.new-room').one('animationend	animationend	webkitAnimationEnd	oanimationend	MSAnimationEnd', function() {
        $(this).hide();
        $(this).removeClass('blink');
        $('.room').addClass('slide-in-bottom fade-in');
      });
      $('.join-room').addClass('slide-out-right fade-out');
    },
    
    showCards: function(e, el, json) {
      console.log(el, json);
      $('.join-room').addClass('blink');
      $('.join-room').one('animationend	animationend	webkitAnimationEnd	oanimationend	MSAnimationEnd', function() {
        $('.new-room').addClass('slide-out-right fade-out');
        $(this).hide();
        $(this).removeClass('blink');
        $('.seat').addClass('slide-in-bottom fade-in');
      });
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new AppFlow();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new AppFlow();

});