'use strict';

module.exports = function(options) {

  options = options || {};

  option.port = option.port || 5000;
  option.host = option.host || 'http://localhost';

  var socket = require('socket.io-client')(option.host + ':' + option.port);

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
}
