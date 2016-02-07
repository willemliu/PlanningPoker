PlanningPoker
==============
__PlanningPoker__ is an app to facilitate the Planning Poker sessions for Agile Development.

## Technologies
__PlanningPoker__ uses the following technologies:

| Technology                                                    | Description                           |
| ------------------------------------------------------------- | ------------------------------------- |
| [NodeJS](https://nodejs.org)                                  | JavaScript runtime                    |
| [Express](http://expressjs.com/)                              | NodeJS web framework                  |
| [Socket.io](http://socket.io/)                                | Websockets framework                  |
| [Gulp](http://gulpjs.com/)                                    | Gulp JavaScript task runner           |
| [Compass](http://compass-style.org)                           | CSS authoring framework (scss/sass)   |
| [Mustache](https://github.com/janl/mustache.js)               | Logic-less templates with JavaScript  |
| [RequireJS](http://requirejs.org)                             | JavaScript file and module loader     |
| [jQuery](http://jquery.com)                                   | jQuery                                |

## Install dependencies
In order to install dependencies for __PlanningPoker__ you can run the following command from the command-line 
in the /dev folder.
```
npm install
```

## Compile
In order to run __PlanningPoker__ you may want to compile it first. 
This is easily done by running `gulp` on the command-line in the /dev folder.
```
gulp
```

## Fire it up!
Start the project by running index.js with NodeJS like so:
```
node index.js
```
The webapplication binds to port 3001.

### Debug
Run `node index.js` in the /dev folder while developing. This uses the uncompressed JavaScript files in the client.

### Test release version (// TODO)
Run `node index.js` in the /www folder to test the code against the minified JavaScript files.
