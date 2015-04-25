'use strict';

module.exports = function(options) {
  options = options || {};

  options.port = options.port || 5000;
  options.host = options.host || 'http://localhost';

  var socket = require('socket.io-client')(options.host + ':' + options.port);

  socket.on('connect', function(){

  });

  socket.on('disconnect', function(){

  });

  return {
    register: function(data, callback) {
      socket.emit('register', data);
    },
    remove: function(data, callback) {
      socket.emit('remove', data);
    },
    get: function(data, callback) {
      socket.emit('get service', data);
    },
    registrations: function(callback) {
      socket.emit('registrations', data);
    },
    newRegistrations: function(callback) {
      socket.emit('new registrations');
    },
    deleteRegistrations: function(callback) {
      socket.emit('delete registrations');
    }
  };
};
