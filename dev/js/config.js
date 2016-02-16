requirejs.config({
    appDir: './js',
    baseUrl: './js/lib',
    paths: {
      app: '../app',
      jquery: 'jquery-2.2.0',
      socketio: 'socket.io'
    },
    dir: './dist',
    removeCombined: true,
    optimize: "uglify2",
    generateSourceMaps: false,
    preserveLicenseComments: false,
    fileExclusionRegExp: /^\.|^node_modules|Gruntfile.js|Gulpfile.js|package.json|.*bat$|3rdpartybackup|uploads|.*scss$|.*eps$|.*log$/i,
    modules: [{
        name: '../config'
    }]
  }
);

var IS_APP = window.location.href.indexOf( 'http://' ) === -1 && window.location.href.indexOf( 'https://' ) === -1;
var EVENT_BUS = {};
var SOCKET; // The one socket.io connection
var BASE_URL = 'http://poker.willim.nl/';
//var BASE_URL = '';
var START_PAGE = '/';

requirejs([
  'jquery',
  'socketio',
  'app/app',
  'app/deviceReady'
], function($, io, App, DeviceReady) {
  
  /**
   * APP START
   */
  document.addEventListener('deviceready', function() {
    if(IS_APP) {
      // Remove splash screen
      if (navigator.splashscreen) {
        navigator.splashscreen.hide();
      }
      // Keep awake
      window.plugins.insomnia.keepAwake(function() {
        console.log('Insomnia');
      });
    }
    SOCKET = io('http://poker.willim.nl');
    // Switch to socket below when debugging locally.
    //SOCKET = io();
    App.getInstance();
    
    // When browser closes
    window.onbeforeunload = function(e) {
      if($('html').hasClass('host')) {
        SOCKET.emit('host left');
      }
      SOCKET.disconnect();
    };
  });
  
  /**
   * Emulate deviceready event
   */
  if(!IS_APP) {
    DeviceReady.getInstance();
  } else {
    // When is app
    START_PAGE = 'index.html';
  }
  
});
