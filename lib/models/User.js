"use strict";
module.exports = class User {
  constructor(config) {
    this.raw = config.raw || {};
    this.interface = config.interface || '';
    this.interfaceId = config.interfaceId || '';
    this.email = config.email || '';
    this.displayName = config.displayName || '';
    this.type = 'User';
    this.timestamp = Date.now();
    this.id = config.id || this._id;
  }

  get _id() {
    return this.interface + ':' + this.interfaceId
  }
}
