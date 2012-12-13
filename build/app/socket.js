define([ 'socketio' ], function( io ) {
  var s = io.connect('http://nclud.roost-recap.jit.su');
  return s || { on: function() {} };
});