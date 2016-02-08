/**
 * App module
 */
define([
  'jquery',
  'app/appFlow',
  'app/rooms'
], function($, AppFlow, Rooms) {
  var instance = null;
  
  function App(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one App, use App.getInstance()");
    }
  }

  App.prototype = {
    init: function() {
      console.log('Initialize app');
      
      AppFlow.getInstance();
      Rooms.getInstance();
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
