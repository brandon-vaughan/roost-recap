define([ 'socketio' ], function( io ) {
  var s = io.connect('http://roost-recap:8000');
  return s || { on: function() {} };
});