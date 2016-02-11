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

var EVENT_BUS = {};
var SOCKET; // The one socket.io connection

requirejs([
  'jquery',
  'socketio',
  'app/app'
], function($, io, App) {
  SOCKET = io();
  App.getInstance();
  
  // When browser closes
  window.onbeforeunload = function(e) {
    SOCKET.disconnect();
  };
});
