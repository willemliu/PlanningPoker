/**
 * App module
 */
define([
  'jquery',
  'mustache',
  'app/appFlow',
  'app/cards',
  'app/rooms',
  'app/socketConfig'
], function($, Mustache, AppFlow, Cards, Rooms, SocketConfig) {
  var instance = null;
  
  function App(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one App, use App.getInstance()");
    }
  }

  App.prototype = {
    init: function() {
      console.log('Initialize app');
      
      /**
       * If this is started as app and not a website.
       */
      if($('html').hasClass('startApp')) {
        console.log('Start as native app');
        this.renderPage();
      }
      
      SocketConfig.getInstance();
      AppFlow.getInstance();
      Rooms.getInstance();
      $(EVENT_BUS).on('PlanningPoker.appFlow:showCards:done', function() {
        Cards.getInstance();
      });
    },
    
    /**
     * Render the page for native app.
     */
    renderPage: function() {
      jQuery.when(
        $.get(BASE_URL + '/templates/partials/body.html'), 
        $.get(BASE_URL + '/templates/partials/footer.html')
      )
      .done(function(body, footer) {
        $('main').prepend(Mustache.render('{{>body}}{{>footer}}', null, {body: body[0], footer: footer[0]}));
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
