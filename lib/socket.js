'use strict';

var registrations = require('./registrations');

module.exports = function(redis) {

  return function(socket) {

    redis.on('updated', function(service){
      socket.to('listener').emit('new service', service);
      socket.to(service.id).emit('register of service', service);
    });

    redis.on('deleted', function(service){
      socket.to('listener').emit('delete service', service);
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

    socket.on('subscribe on service', function(serviceClient, serviceSubscribe, alias) {

      redis.getRegistrations({
        name: serviceSubscribe
      }, function(err, services) {

        if (err) {
          console.log(err);
        }

        if (services.length > 0) {
          socket.join(services[0].id);
          socket.to(serviceClient.id).emit('service subscribed', services[0], alias);
        }

      });

    });

  };
};
