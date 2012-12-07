/**
 * Node Socket.io
 * 
 */

/*====================================
=            Dependencies            =
====================================*/

// Config: Config object with server settings
var config = require( './config.js' );

// Express(bodyParser()): An advanced html framework
var express = require( 'express' );

// FS: Node module for file read and write
var fs = require( 'fs' );

// App: Instantiate Express( bodyParser() ); bodyParser wrapes for JSON, urlencoded, and multipart 
var app = express( express.bodyParser() );

// Server.listen(port): Instantiate node server with app framework
var server = require( 'http' ).createServer( app );

// Socket.io: Real time node module for events 
var io = require( 'socket.io' ).listen( server );

// Set server port
server.listen( config.port );

/*====================================================
=            Node Server Constructor            =
====================================================*/
module.exports = function() {

  /*==========  Create Socket.io Connection  ==========*/
  io.sockets.on('connection', function( socket ) {

  });  

  /*==========  Create App Routes  ==========*/

  // Unit Testing
  app.use( '/_test', express.static( config.baseDir + 'test') );

  // Running Server Message
  console.log( 'Serving on ' + config.baseUrl + ':' + config.port );

};
