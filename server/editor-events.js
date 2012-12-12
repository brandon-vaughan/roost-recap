module.exports = (function() {

  var EditorEvents = function() {


  };

  EditorEvents.prototype.update = function( io, data ) {

    return io.sockets.emit( 'editor:update', data );
  }

  return EditorEvents;

}());