module.exports = (function() {

  var PrezEvents = function() {


  };

  PrezEvents.prototype.updateSlide = function( socket, data ) {

    return socket.broadcast.emit( 'prez:updateslide', data );
  }

  PrezEvents.prototype.updateFrame = function( socket, data ) {

    return socket.broadcast.emit( 'prez:updateframe', data );
  
  }

  return PrezEvents;

}());