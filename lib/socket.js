'use strict';

var registrations = require('./registrations');

module.exports = function(redis) {

  return function(socket) {

    socket.on('add', function(data) {
      var service = registrations.create(data);
      redis.update(service, function() {
        socket.to('listener').emit('new service', service);
        socket.emit('register of service', service);
      });
    });

    socket.on('register as listener', function() {
      socket.join('listener');
    });

    socket.on('delete', function(service) {
      redis.delete(service, function() {
        socket.to('listener').emit('delete service', service);
      });
    });

    socket.on('subscribe on service', function(serviceSubscribe, alias) {

      redis.getRegistrations({
        name: serviceSubscribe
      }, function(err, services) {

        if (err) {
          console.log(err);
        }

        if (services.length > 0) {
          socket.emit('service subscribed', services[0], alias);
        }

      });

    });

  };
};
