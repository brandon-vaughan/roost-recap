module.exports = (function() {

  var prezCurrent = {
    onDisplay: 0,
    onStage: 0
  };

  var PrezEvents = function() {


  };

  PrezEvents.prototype.goToCurrent = function( socket ) {

    var current = {
      onDisplay: prezCurrent.onDisplay,
      onStage: prezCurrent.onStage
    };
    return socket.emit( 'prez:gotocurrent', current );

  }

  PrezEvents.prototype.updateSlide = function( socket, data ) {

    prezCurrent.onDisplay = data.onDisplay;

    return socket.broadcast.emit( 'prez:updateslide', data );
  }

  PrezEvents.prototype.updateFrame = function( socket, data ) {

    prezCurrent.onStage = data.onStage;

    return socket.broadcast.emit( 'prez:updateframe', data );
  
  }

  return PrezEvents;

}());