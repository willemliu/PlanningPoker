/**
 * Controller for Home
 */
module.exports = function(app, fs, mustache) {
  console.log("Initialize Home controller");

  var data = {
    title: 'Home',
    html_classes: 'home'
  }; // wrap the data in a global object... (mustache starts from an object then parses)
  
  /**
   * Controller for /
   */
  app.get('/', getIndex);
  function getIndex(req, res){ // INDEX
    renderHtml(res, data);
  };
  
  function renderHtml(res, data) {
    var head = fs.readFileSync('mustache/partials/head.html', "utf8"); // bring in the HEAD
    var body = fs.readFileSync('mustache/partials/body.html', "utf8"); // bring in the BODY
    var footer = fs.readFileSync('mustache/partials/footer.html', "utf8"); // bring in the FOOTER
    var page = fs.readFileSync('mustache/main.html', "utf8"); // bring in the HTML file
    var html = mustache.to_html(page, data, {head: head, body: body, footer: footer}); // replace all of the data
    res.send(html);
  }

}
