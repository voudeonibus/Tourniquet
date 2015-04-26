'use strict';

module.exports = function(socket, client) {

  socket.on('connect', function() {
    client.add();
  });

  socket.on('disconnect', function() {

  });

  socket.on('new service', function(service) {
    client.service = service;
    client.events.emit('new service', client.service);
  });

};
