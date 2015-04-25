'use strict';

var Hapi = require('hapi');
var sockets = require('./socket');

module.exports = function(option) {

  option = option || {};

  var server = new Hapi.Server();
  server.connection({ port: option.PORT || 5000 });

  var io = require('socket.io')(server.listener);
  var redis = new require('./redis')();

  io.on('connection', sockets(redis));

  server.start();
};
