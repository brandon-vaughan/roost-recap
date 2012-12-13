define(['socket'],function(socket) {

  var authkey = 'mysecretkey';
  var authkeysecret = 'supersecret';

  var Auth = function() {

    this.keysecret = false;

  };

  Auth.prototype.login = function(key) {
    
    if ( key === authkey ) {

      // Set Keysecret
      this.keysecret = authkeysecret;

      // Setup Host Environment
      var hostAccess = { keysecret: this.keysecret };
      socket.emit('editor:ishost', hostAccess);
      
      // Wazup
      return { key: 'peekabo' }
    }
  
  };

  Auth.prototype.isHost = function() {

    return this.keysecret === authkeysecret ? true : false;
  
  };

  return Auth;

});