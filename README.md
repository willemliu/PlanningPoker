PlanningPoker
==============
__PlanningPoker__ is an app to facilitate the Planning Poker sessions for Agile Development.

## Features
* Real-time application
* Host <-> Guest application
  * One browser starts the game as host
  * Players can then connect to the game from their own devices
  * This allows you to cast the host screen to a big screen for the vote overview while keeping the votes secret until revealed
* Automatically turn cards when every player has voted
* Every player gains the ability to reset the game after cards are turned (No game master needed to control the host)
* Player is automatically removed from the __Room__ when player disconnects
* Cards with most votes are highlighted

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
Run `node planningPoker.js` in the /dev folder while developing. This uses the uncompressed JavaScript files in the client.

### Run release version
Run `node planningPoker.js` in the /www folder.

### Watch
While in development you might want to watch the SCSS and JS files for changes and have them compiled as soon as possible.
This is can be done by running the following command in the /dev folder:
```
gulp watch
```
