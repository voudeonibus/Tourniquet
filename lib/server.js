var Hapi = require('hapi');

module.exports = function(option) {

  option = option || {};

  var server = new Hapi.Server();
  server.connection({ port: option.PORT || 5000 });

  var io = require('socket.io')(server.listener);

  io.on('connection', function (socket) {

      socket.on('add', function (data) {
        
      });

      socket.on('remove', function(data) {

      });

      socket.on('registrations', function() {

      })
  });

  server.start();
};
