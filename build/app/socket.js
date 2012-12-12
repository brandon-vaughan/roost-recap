define([ 'socketio' ], function( io ) {
  var s = io.connect('http://liveprez:8000');
  return s || { on: function() {} };
});