/**
 * Controller for static files and resources
 */
module.exports = function(app, express) {
  console.log("Initialize static controllers");
  app.use("/index.html", express.static('index.html')); // Expose /index.html folder as /index.html
  app.use("/privacy.txt", express.static('privacy.txt')); // Expose /privacy.txt as /privacy.txt
  app.use("/js", express.static('js')); // Expose /dist folder as /js
  app.use("/img", express.static('img')); // Expose /img folder as /img
  app.use("/css", express.static('css')); // Expose /css folder as /css
  app.use("/favicon.ico", express.static('img/favicon.ico')); // Expose /favicon.ico as /img/favicon.ico
  app.use("/templates", express.static('mustache')); // Expose /templates as /mustache 
}