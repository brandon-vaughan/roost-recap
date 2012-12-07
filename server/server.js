/**
 * Node Socket.io
 * 
 */

/*====================================
=            Dependencies            =
====================================*/

// Express(bodyParser()): An advanced html framework
var express = require( 'express' );

// Socket.io: Real time node module for events 
var io = require( 'socket.io' );

// FS: Node module for file read and write
var fs = require( 'fs' );

// App: Instantiate Express( bodyParser() ); bodyParser wrapes for JSON, urlencoded, and multipart 
var app = express( express.bodyParser() );

// Server.listen(port): Instantiate node server with app framework; port >= 1080
var server = require('http').createServer( app );

// IO: create socket.io instance;
io.listen( server );

// baseDir: for routes and loading
var baseDir   = __dirname + '/../';

/*====================================================
=            Node Server Constructor            =
====================================================*/
module.exports = function() {

  /*==========  Create Socket.io Connection  ==========*/
  

  /*==========  Create App Routes  ==========*/

  // Unit Testing

};
