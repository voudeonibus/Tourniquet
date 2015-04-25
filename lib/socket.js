var EventEmitter = require('events').EventEmitter;

module.exports = function(redis) {

  redis.on('updated', function(){
    socket.emit('new registrations');
  });

  redis.on('deleted', function(){
    socket.emit('delete registrations');
  });

  return function(socket) {
    socket.on('add', function (data) {
      console.log(redis);
      redis.update(data);
    });

    socket.on('delete', function(data) {
      redis.delete(data);
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
