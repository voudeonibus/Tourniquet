var EventEmitter = require('events').EventEmitter;

module.exports = function(redis) {

  return function(socket) {

    redis.on('updated', function(service){
      socket.emit('new service', service);
    });

    redis.on('deleted', function(serviceID){
      socket.emit('delete service', serviceID);
    });

    socket.on('add', function (data) {
      redis.update(data);
    });

    socket.on('delete', function(serviceID) {
      redis.delete(serviceID);
    });

    socket.on('get service', function(data) {
      redis.getRegistrations(data);
    });

    socket.on('services', function() {
      redis.getRegistrations();
    });

    socket.on('new service', function(data) {

    });

    socket.on('delete service', function(data) {

    });
  };
};
