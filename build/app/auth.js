define(function() {

  var Auth = function() {


  };

  Auth.prototype.login = function(key) {
    if ( key === 'mysecretkey' ) {
      this.key = 'supersecret';
      return { key: 'peekabo' }
    }
  }

  return Auth;

});