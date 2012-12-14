module.exports = (function() {

  var EditorMembers = {
    host: false,
    guest: false
  };

  var EditorEvents = function() {


  };

  /**
   * welcomeHost: Send confirmation to host
   * @param  {obj} socket [description]
   * @param  {obj} data   [description]
   * @return {[type]}        [description]
   */
  EditorEvents.prototype.welcomeHost = function( socket, data ) {
    EditorMembers.host = socket.id;
    return socket.emit( 'editor:welcomehost', data );
  };

  /**
   * [askHost description]
   * @param  {[type]} io     [description]
   * @param  {[type]} socket [description]
   * @return {[type]}        [description]
   */
  EditorEvents.prototype.askHost = function( io, socket, request ) {

    request.guest = socket.id;

    return io.sockets.socket(EditorMembers.host).emit( 'editor:requestaccess', request );

  };

  EditorEvents.prototype.welcomeGuest = function( io, request ) {
    // set editor guest
    EditorMembers.guest = request.guest;
    return io.sockets.socket(request.guest).emit( 'editor:welcomeguest', request );
  };

  EditorEvents.prototype.declineGuest = function( io, request ) {
    // remove editor guest
    EditorMembers.guest = false;
    return io.sockets.socket(request.guest).emit( 'editor:declineguest', request );
  };


  /**
   * update - update editors for all attendees
   * @param  {obj} io   socket.io class
   * @param  {obj} data editor.id and editor.value
   * @return {event}      send event
   */
  EditorEvents.prototype.update = function( io, data ) {
    return io.sockets.emit( 'editor:update', data );
  };

  return EditorEvents;

}());