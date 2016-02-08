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
This is easily done by running the following command on the command-line in the /dev folder.
```
gulp release
```
That will build all the CSS and JS files and copy the necessary files to the /www folder.

## Fire it up!
Start the project by running index.js with NodeJS like so:
```
node index.js
```
The webapplication binds to port 3001.

### Debug
Run `node index.js` in the /dev folder while developing. This uses the uncompressed JavaScript files in the client.

### Run release version
Run `node index.js` in the /www folder.

### Watch
While in development you might want to watch the SCSS and JS files for changes and have them compiled as soon as possible.
This is can be done by running the following command in the /dev folder:
```
gulp watch
```