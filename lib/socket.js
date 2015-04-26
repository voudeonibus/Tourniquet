'use strict';

var registrations = require('./registrations');

module.exports = function(redis) {

  return function(socket) {

    redis.on('updated', function(service){
      socket.to(service.id)emit('new service', service);
    });

    redis.on('deleted', function(serviceID){
      socket.to(serviceID).emit('delete service', serviceID);
    });

    socket.on('add', function (data) {
      var service = registrations.create(data);
      socket.join(service.id);
      redis.update(service);
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

    socket.on('new service', function() {

    });

    socket.on('delete service', function() {

    });
  };
};
