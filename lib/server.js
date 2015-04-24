var Hapi = require('hapi');

module.exports = function(option) {

  option = option || {};

  var server = new Hapi.Server();
  server.connection({ port: option.PORT || 5000 });

  var io = require('socket.io')(server.listener);

  io.on('connection', function (socket) {

      socket.on('register', function (data) {

      });

      socket.on('remove', function(data) {

      });

      socket.on('get service', function(data) {

      });

      socket.on('registrations', function() {

      });

      socket.on('new registrations', function(data) {

      });

      socket.on('delete registrations', function(data) {

      });

  });

  server.start();
};
