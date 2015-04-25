'use strict';

// Require modules
var util = require('util');
var events = require('events');
var registrations = require('./registrations');

var Redis = module.exports = function Redis(options, socket) {

  events.EventEmitter.call(this);

  options = options || {};

  this.redisClient = require('ioredis')({
    port: options.redis_port || process.env.REDIS_PORT || 6379,
    host: options.redis_host || process.env.REDIS_HOST || '127.0.0.1',
    family: 4,
    password: options.redis_password || process.env.REDIS_PASSWORD || undefined,
    db: options.redis_db || process.env.REDIS_DB || 4
  });

};

util.inherits(Redis, events.EventEmitter);

/**
 * update() Update or create a registration of service.
 *
 * @param {Object} service
 */

Redis.prototype.update = function(service) {

  var self = this;
  var register = registrations.create(service);

  self.redisClient.multi()
  .set(register.id, register.stringify())
  .exec(function(){
    self.emit('updated', register);
  });

};

/**
 * delete() Delete a registration of service.
 *
 * @param {String} serviceID
 */

Redis.prototype.delete = function(serviceID) {

  var self = this;

  self.redisClient.multi()
  .del(serviceID)
  .exec(function (error, replies) {
    self.emit('deleted', serviceID);
  });

};

/**
 * getRegistrations() Find all registrations for 'name' if provided.
 *
 */

Redis.prototype.getRegistrations = function() {

};

/**
 * clearDatabase() Clear database.
 */

Redis.prototype.clearDatabase = function() {
  this.redisClient.flushdb();
};
