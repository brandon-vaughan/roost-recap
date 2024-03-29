require.config({
  deps: [
    window.location.pathname === '/_test/runner/' ? 'test/config' : 'app'
  ],
  urlArgs: 'bust='+new Date().getTime(),
  baseURL: '/vendors',
  paths: {
    underscore: 'underscore',
    backbone: 'backbone',
    jquery: '../vendors/jquery',
    codemirror: '../vendors/codemirror',
    text: 'text',
    prism: 'prism',
    socketio: 'http://roost-recap:8000/socket.io/socket.io'
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