require.config({
  deps: [
    window.location.pathname === '/_test/runner/' ? 'test/config' : 'app'
  ],
  paths: {
    baseURL: 'http://liveprez:8000/',
    underscore: '../vendors/underscore',
    backbone: '../vendors/backbone',
    jquery: '../vendors/jquery',
    text: '../vendors/text',
    prism: '../vendors/prism',
    test: '/_test',
    socketio: 'socket.io/socket.io'
  },
  shim: {
    'socketio': {
      exports: 'io'
    },
    'underscore': {
      exports: '_'
    },
    'backbone': {
      exports: 'Backbone',
      deps: [ 'jquery', 'underscore' ]
    }
  }
});