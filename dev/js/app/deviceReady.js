/**
 * DeviceReady triggers the deviceready event for Cordova apps when not run as app.
 */
define([],function () {
  var instance = null;
  
  /**
   * Constructor
   */
  function DeviceReady() {
    if(instance !== null){
      throw new Error("Cannot instantiate more than one DeviceReady, use DeviceReady.getInstance()");
    }
  }
    
  /**
   * Class definition.
   */
  DeviceReady.prototype = {
    init: function() {
      console.log('Initialize DeviceReady');
      var event = document.createEvent("HTMLEvents");
      event.initEvent("deviceready", true, true);
      event.eventName = "deviceready";
      if (document.createEvent) {
        document.dispatchEvent(event);
      } else {
        document.fireEvent("on" + event.eventType, event);
      }
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new DeviceReady();
        this.init();
      }
      return instance;
    }

  };
  
  return instance||new DeviceReady();
});
