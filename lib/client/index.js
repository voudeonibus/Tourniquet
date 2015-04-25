'use strict';

// Require modules
var sockets = require('./socket');
var ip = require('ip');
var events = require('events');

var Client = module.exports = function(options) {

  events.EventEmitter.call(this);

  options = options || {};

  options.turnstile_port = options.turnstile_port || process.env.TURNSTILE_PORT || 5000;
  options.turnstile_host = options.turnstile_host || process.env.TURNSTILE_HOST || 'http://localhost';

  if (!options.service) {
    throw 'Error name service';
  }

  this.service = {};
  this.socket = require('socket.io-client')(options.turnstile_host + ':' + options.turnstile_port);

  sockets(this.socket, this);

  this.socket.emit('add', {
    name: options.service,
    version: options.version,
    host: ip.address(),
    port: options.port
  });

  // return {    // on: emitter.on,
  //   remove: function(data, callback) {
  //     socket.emit('remove', data);
  //   },
  //   get: function(data, callback) {
  //     socket.emit('get service', data);
  //   },
  //   registrations: function(callback) {
  //     socket.emit('services', data);
  //   },
  //   newRegistrations: function(callback) {
  //     socket.emit('new service');
  //   },
  //   deleteRegistrations: function(callback) {
  //     socket.emit('delete service');
  //   }
  // };
};

Client.prototype.__proto__ = events.EventEmitter.prototype;

Client.prototype.delete = function() {
  this.socket.emit('delete', this.service.id)
};
