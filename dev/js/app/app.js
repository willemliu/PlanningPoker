/**
 * App module
 */
define([
  'jquery',
  'app/appFlow',
  'app/cards',
  'app/rooms',
  'app/socketConfig'
], function($, AppFlow, Cards, Rooms, SocketConfig) {
  var instance = null;
  
  function App(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one App, use App.getInstance()");
    }
  }

  App.prototype = {
    init: function() {
      console.log('Initialize app');
      SocketConfig.getInstance();
      AppFlow.getInstance();
      Rooms.getInstance();
      $(EVENT_BUS).on('PlanningPoker.appFlow:showCards:done', function() {
        Cards.getInstance();
      });
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new App();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new App();
});
