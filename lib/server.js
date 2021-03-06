'use strict';

// Require modules
var Hapi = require('hapi');
var sockets = require('./socket');
var Redis = require('./redis');

require('colors');

module.exports = function(option) {

  option = option || {};

  var server = new Hapi.Server();
  server.connection({ port: option.port || 5000 });

  var io = require('socket.io')(server.listener);
  var redis = new Redis(option);

  io.on('connection', sockets(redis));

  server.route({
    method: 'GET',
    path: '/services',
    handler: function(request, reply) {
      redis.getRegistrations(function(err, services) {
        if (err) {
          console.log(err);
        }
        reply(services);
      });
    }
  });

  // Init server
  server.start(function() {
    console.log('Server Tourniquet running at:'.green + ' %d', server.connections[0].info.port);
  });

  process.on('SIGTERM', function() {
    redis.clearDatabase();
  });
};
