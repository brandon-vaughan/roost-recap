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

// Set server port
server.listen( config.port );

// Socket.io: Real time node module for events 
var io = require( 'socket.io' ).listen( server );

/*====================================================
=            Node Server Constructor            =
====================================================*/
module.exports = function() {

  /*==========  Create Socket.io Connection  ==========*/
  io.sockets.on('connection', function( socket ) {

    /*==========  Editor Events  ==========*/
    var editorEvents = require( './editor-events.js' );
    var editor = new editorEvents();

    socket.on('editor:change', function(data) {
      console.log('received editorchange...');
      editor.update(io, data);
    
    });

    /*==========  Prez Events  ==========*/
    var prezEvents = require( './prez-events.js' );
    var prez = new prezEvents();

    socket.on('prez:changeslide', function(data) {
      console.log('received changeslide...');
      prez.updateSlide(socket, data);
    });

    socket.on('prez:changeframe', function(data) {
      console.log('received changeframe...');
      prez.updateFrame(socket, data);
    });

  });

  /*==========  Create App Routes  ==========*/

  // Unit Testing
  app.use( '/_test', express.static( config.baseDir + 'test') );
  app.use( '/_build', express.static( config.baseDir + 'build') );
  app.use( '/_vendors', express.static( config.baseDir + 'build/vendors') );

  // Running Server Message
  console.log( 'Serving on ' + config.baseUrl + ':' + config.port );

};

