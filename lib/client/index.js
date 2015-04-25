'use strict';

// Require modules
var sockets = require('./socket');
var ip = require('ip');
var events = require('events');
var util = require('util');
var request = require('request');

var Client = module.exports = function(options) {

  events.EventEmitter.call(this);

  options = options || {};

  this.turnstile_port = options.turnstile_port || process.env.TURNSTILE_PORT || 5000;
  this.turnstile_host = options.turnstile_host || process.env.TURNSTILE_HOST || 'http://localhost';

  if (!options.service) {
    throw 'Error name service';
  }

  this.service = {};
  this.socket = require('socket.io-client')(this.turnstile_host + ':' + this.turnstile_port);

  sockets(this.socket, this);

  this.socket.emit('add', {
    name: options.service,
    version: options.version,
    host: ip.address(),
    port: options.port
  });
};

util.inherits(Client, events.EventEmitter);

Client.prototype.delete = function() {
  this.socket.emit('delete', this.service.id);
};

Client.prototype.allServices = function(callback) {
  request(this.turnstile_host + ':' + this.turnstile_port, function (error, response, body) {
    callback(JSON.parse(body));
  });
};
