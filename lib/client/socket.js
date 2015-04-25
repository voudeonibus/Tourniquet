'use strict';

module.exports = function(socket, client) {

  socket.on('connect', function() {

  });

  socket.on('disconnect', function() {

  });

  socket.on('new service', function(service) {
    client.service = service;
    client.emit('new service', client.service);
  });

  socket.on('delete service', function() {

  });

};
