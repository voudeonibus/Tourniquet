module.exports = function(socket, emitter) {

  socket.on('connect', function() {

  });

  socket.on('disconnect', function() {

  });

  socket.on('new service', function(service) {
    emitter.emit('new service', service);
  });

  socket.on('delete service', function() {

  });

};
