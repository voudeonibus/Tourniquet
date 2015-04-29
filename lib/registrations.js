'use strict';

// Require modules
var assert = require('assert');
var util = require('util');

function Registration (reg) {

  this.name = String(reg.name);
  this.version = String(reg.version);
  this.host = String(reg.host);
  this.port = parseInt(reg.port, 10);
  this.lastKnown = reg.lastKnown || Date.now();
  this.meta = reg.meta || {};
  this.id = util.format('/%s/%s/%s/%s', this.name, this.version, this.host, this.port);

  this.stringify = function () {
    return JSON.stringify(this);
  };
}

var registrations = module.exports = {

  create: function createRegistration (reg) {
    assert.equal(typeof reg, 'object', 'reg must be an object');
    return new Registration(reg);
  },

  parse: function parseRegistration (stringifiedReg) {
    assert.equal(typeof stringifiedReg, 'string', 'stringifiedReg must be a string');
    var reg = JSON.parse(stringifiedReg);
    return new Registration(reg);
  },

  parseId: function parseId (id) {
    if (!registrations.isRegistrationId(id)) {
      return null;
    }

    var parts = id.split('/');
    return registrations.createRegistration({
      name: parts[1],
      version: parts[1],
      host: parts[1],
      port: parts[1]
    });
  },

  isRegistrationId: function isRegistrationId (id) {
    return (/\/.+\/.+\/.+\/.+/).test(id);
  }
};
