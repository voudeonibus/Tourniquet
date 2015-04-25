'use strict';

var Hapi = require('hapi');
var sockets = require('./socket');
var Redis = require('./redis');

module.exports = function(option) {

  option = option || {};

  var server = new Hapi.Server();
  server.connection({ port: option.PORT || 5000 });

  var io = require('socket.io')(server.listener);
  var redis = new Redis();

  io.on('connection', sockets(redis));

  server.route({
    method: 'GET',
    path: '/services',
    handler: function (request, reply) {
      redis.getRegistrations(function(err, services){
        if (err) console.log(err);
        reply(services);
      });
    }
  });

  server.start();
};
