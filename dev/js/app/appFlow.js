/**
 * AppFlow regulates the flow of the application
 */
define([
  'jquery'
], function($) {
  var instance = null;
  
  function AppFlow(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one AppFlow, use AppFlow.getInstance()");
    }
  }

  AppFlow.prototype = {
    init: function() {
      console.log('Initialize AppFlow');
      $(document).on('click', '#newRoom', this.showNewRoom);
      $(EVENT_BUS).on('PlanningPoker.room:joinRoom:error', this.shakeGuest);
      $(EVENT_BUS).on('PlanningPoker.room:joinRoom:joined', this.showCards);
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
      $(EVENT_BUS).trigger('PlanningPoker.appFlow:shakeGuest:done');
    },
    
    showNewRoom: function() {
      $('html').addClass('host');
      $('.new-room').addClass('blink');
      $('.new-room').one('animationend	animationend	webkitAnimationEnd	oanimationend	MSAnimationEnd', function() {
        $(this).hide();
        $(this).removeClass('blink');
        $('.room').addClass('slide-in-bottom fade-in');
      });
      $('.join-room').addClass('slide-out-right fade-out');
      $(EVENT_BUS).trigger('PlanningPoker.appFlow:showNewRoom:done');
    },
    
    showCards: function(e, el, json) {
      $('.join-room').addClass('blink');
      $('.join-room').one('animationend	animationend	webkitAnimationEnd	oanimationend	MSAnimationEnd', function() {
        $('.new-room').addClass('slide-out-right fade-out');
        $(this).hide();
        $(this).removeClass('blink');
        $('.seat').addClass('slide-in-bottom fade-in');
      });
      $(EVENT_BUS).trigger('PlanningPoker.appFlow:showCards:done');
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