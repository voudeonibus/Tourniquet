'use strict';

var registrations = require('./registrations');

module.exports = function(redis) {

  return function(socket) {

    redis.on('updated', function(service){
      socket.to(service.id).to('listener').emit('new service', service);
    });

    redis.on('deleted', function(service){
      socket.to(service.id).to('listener').emit('delete service', serviceID);
    });

    socket.on('add', function (data) {
      var service = registrations.create(data);
      socket.join(service.id);
      redis.update(service);
    });

    socket.on('register as listener', function(){
      socket.join('listener');
    });

    socket.on('delete', function(service) {
      redis.delete(service);
    });

    socket.on('get service', function(data) {
      redis.getRegistrations(data);
    });

    socket.on('services', function() {
      redis.getRegistrations();
    });

  };
};
