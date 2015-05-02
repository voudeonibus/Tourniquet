'use strict';

// Require modules
var sockets = require('./socket');
var ip = require('ip');
var events = require('events');
var util = require('util');
var request = require('request');
var _ = require('lodash');

/**
 * Client for Tourniquet
 * @constructor
 * @param {Object} options
 */
var Client = module.exports = function(options) {

  events.EventEmitter.call(this);

  // Applies the default values to options
  options = _.assign({
    listener: false
  }, options);

  this.options = options;

  /**
   * Options to connect to the central server Tourniquet
   * @access private
   */
  this._tourniquet_port = options.tourniquet_port || process.env.TOURNIQUET_PORT || 5000;
  this._tourniquet_host = options.tourniquet_host || process.env.TOURNIQUET_HOST || 'http://localhost';

  /**
   * List of services that the customer is subscribed to communicate
   * @access private
   */
  this._servicesSubscribed = [];

  // Connect to socket server Tourniquet, where most process occur
  this.socket = require('socket.io-client')(this._tourniquet_host + ':' + this._tourniquet_port);

  // Maps all socket events
  sockets(this.socket, this);

  // To stop the process, you need to delete the central registry service
  process.on('SIGTERM', this.exit.bind(this));

};

util.inherits(Client, events.EventEmitter);

/**
 * exit() Need to delete the central registry service on exit of process
 * @param {Object} option
 * @param {Object} err
 */
Client.prototype.exit = function(option, err) {
  if (err) {
    console.log(err.stack);
  }
  this.delete();
  process.exit();
};

/**
 * delete() emit event 'delete' the service
 */
Client.prototype.delete = function() {
  if (this.service) {
    this.socket.emit('delete', this.service);
  }
};

/**
 * add() emit event 'add' to registry the service
 */
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

/**
 * registerAsLister() register as listener to catch all events of services
 */
Client.prototype.registerAsListener = function() {
  if (this.options.listener || !this.options.service) {
    this.socket.emit('register as listener');
  }
};

/**
 * allServices() get all services of Tourniquet
 * @param {Function} callback
 *
 * @callback callback
 * @param {Object[]} content of response
 */
Client.prototype.allServices = function(callback) {
  request(this._tourniquet_host + ':' + this._tourniquet_port + '/services', function (error, response, body) {
    if (body === undefined) {
      callback([]);
    } else {
      callback(JSON.parse(body));
    }
  });
};

/**
 * emittSubscribed() subscribe to all services of client
 */
Client.prototype.emittSubscribed = function() {

  if (this.options.subscribes) {
    for (var i = 0, _len = this.options.subscribes.length; i < _len; i++) {
      var subscribe = this.options.subscribes[i];
      this.socket.emit('subscribe on service', subscribe.service, subscribe.alias);
    }
  }

};

/**
 * registerServiceSubscribed() register intern the ID of services subscribed
 * @param {Object} service - service returned of Tourquinet
 * @param {String} alias - alias of name service on comunnication
 */
Client.prototype.registerServiceSubscribed = function(service, alias) {
  this._servicesSubscribed[alias || service.name] = service;
};

/**
 * get() to get service on communicate
 * @param {String} nameService - name or alias of services subscribed
 * @return {Function} functionAction
 *
 * @callback functionAction
 * @param {String} action - path of action
 * @param {Function} callback - function executed on return of request
 *
 * @callback callback
 * @param {Object} error - error of return request
 * @param {Object} body - return of request
 */
Client.prototype.get = function(nameService) {
  var service = this._servicesSubscribed[nameService];

  return function(action, callback) {

    var prefix = (this.options.meta_target ? service.meta[this.options.meta_target] : '');

    request('http://' + service.host + ':' + service.port + prefix + '/' + action, function (error, response, body) {
      callback(error, JSON.parse(body));
    });

  }.bind(this);
};
