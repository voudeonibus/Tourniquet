'use strict';

// Require modules
var sockets = require('./socket');
var ip = require('ip');
var events = require('events');
var util = require('util');
var request = require('request');

var Client = module.exports = function(options) {

  events.EventEmitter.call(this);

  options = options || {listener: false};

  this.options = options;
  this.tourniquet_port = options.tourniquet_port || process.env.TOURNIQUET_PORT || 5000;
  this.tourniquet_host = options.tourniquet_host || process.env.TOURNIQUET_HOST || 'http://localhost';

  this.socket = require('socket.io-client')(this.tourniquet_host + ':' + this.tourniquet_port);

  sockets(this.socket, this);

  process.on('exit', this.exit.bind(this));

  process.on('SIGINT', this.exit.bind(this));

  process.on('SIGTERM', this.exit.bind(this));

  process.on('uncaughtException', this.exit.bind(this));
};

util.inherits(Client, events.EventEmitter);

Client.prototype.exit = function(option, err) {
  if (err) {
    console.log(err.stack);
  }
  this.delete();
  process.exit();
};

Client.prototype.delete = function() {
  if (this.service) {
    this.socket.emit('delete', this.service);
  }
};

Client.prototype.add = function() {

  if (this.options.service) {
    this.socket.emit('add', {
      name: this.options.service,
      version: this.options.version,
      host: this.options.host || ip.address(),
      port: this.options.port,
      meta: this.options.meta || {}
    });
  }
};

Client.prototype.registerAsListener = function() {
  if (this.options.listener || !this.options.service) {
    this.socket.emit('register as listener');
  }
};

Client.prototype.allServices = function(callback) {
  request(this.turnstile_host + ':' + this.turnstile_port + '/services', function (error, response, body) {
    callback(JSON.parse(body));
  });
};
