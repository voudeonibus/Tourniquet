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

  this.options = options;
  this.turnstile_port = options.turnstile_port || process.env.TURNSTILE_PORT || 5000;
  this.turnstile_host = options.turnstile_host || process.env.TURNSTILE_HOST || 'http://localhost';

  this.socket = require('socket.io-client')(this.turnstile_host + ':' + this.turnstile_port);

  sockets(this.socket, this);

  process.on('exit', this.exit.bind(this));

  process.on('SIGINT', this.exit.bind(this));

  process.on('SIGTERM', this.exit.bind(this));

  process.on('uncaughtException', this.exit.bind(this));
};

util.inherits(Client, events.EventEmitter);

Client.prototype.exit = function(option, err) {
  if (err) console.log(err.stack);
  this.delete();
  process.exit();
}

Client.prototype.delete = function() {
  if (this.service) {
    this.socket.emit('delete', this.service.id);
  }
};

Client.prototype.add = function() {

  if (this.options.service) {
    this.socket.emit('add', {
      name: this.options.service,
      version: this.options.version,
      host: ip.address(),
      port: this.options.port
    });
  }
};

Client.prototype.allServices = function(callback) {
  request(this.turnstile_host + ':' + this.turnstile_port + '/services', function (error, response, body) {
    callback(JSON.parse(body));
  });
};
