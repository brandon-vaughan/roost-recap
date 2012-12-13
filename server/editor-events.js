module.exports = (function() {

  var EditorEvents = function() {


  };

  EditorEvents.prototype.welcomeHost = function( socket, data ) {
    return socket.emit( 'editor:welcomehost', data );
  }


  /**
   * update - update editors for all attendees
   * @param  {obj} io   socket.io class
   * @param  {obj} data editor.id and editor.value
   * @return {event}      send event
   */
  EditorEvents.prototype.update = function( io, data ) {

    return io.sockets.emit( 'editor:update', data );
  }

  return EditorEvents;

}());