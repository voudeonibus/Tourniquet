'use strict';

// Require modules
var util = require('util');
var events = require('events');
var registrations = require('./registrations');

var Redis = module.exports = function Redis(options) {

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

Redis.prototype.update = function(service, callback) {

  var self = this;

  self.redisClient.multi()
  .set(service.id, service.stringify())
  .exec(function(){

    if (callback) {
      callback();
    }

  });

};

/**
 * delete() Delete a registration of service.
 *
 * @param {String} serviceID
 */

Redis.prototype.delete = function(service, callback) {

  var self = this;

  self.redisClient.multi()
  .del(service.id)
  .exec(function(error) {
    if (error) {
      console.log(error);
    }

    if (callback) {
      callback();
    }

  });

};

/**
 * getRegistrations() Find all registrations for 'name' if provided.
 *
 */

Redis.prototype.getRegistrations = function(service, callback) {

  var self = this;
  var keySearch;

  if (typeof service === 'function') {
    callback = service;
    keySearch = '/*';
  } else {
    if (service.name && service.version) {
      keySearch = util.format('/%s/%s/*', service.name, service.version);
    }

    if (service.name) {
      keySearch = util.format('/%s/*', service.name);
    }
  }

  self.redisClient.keys(keySearch, function(err, ids) {
    if (err) {
      return callback(err);
    }

    if (!ids || ids.length === 0) {
      return callback(null, []);
    }

    var regIds = ids.filter(function(id) {
      return registrations.isRegistrationId(id);
    });

    if (regIds.length === 0) {
      return callback(null, []);
    }

    self.redisClient.mget(ids, function(errMget, stringifiedRegs) {
      if (errMget) {
        return callback(errMget);
      }

      var regs = stringifiedRegs.map(function(stringifiedReg) {
        return registrations.parse(stringifiedReg);
      });

      callback(null, regs);
    });
  });
};

/**
 * clearDatabase() Clear database.
 */

Redis.prototype.clearDatabase = function() {
  this.redisClient.flushdb();
};
