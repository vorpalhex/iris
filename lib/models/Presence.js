"use strict";
const uuid = require('uuid');

const User = require('./User');

module.exports = class Presence {
  constructor(config) {
    this.status = config.status || 'online';
    this.user = {};
    this.raw = config.raw || {};
    this.interface = config.interface || '';
    this.substatus = config.substatus || '';
    this.type = 'Presence';
    this.timestamp = Date.now();
    this.id = uuid.v4();

    if(config.user){
      if(config.user instanceof User) {
        this.user = config.user;
      } else {
        this.user = User(config.user);
        if(!this.user.raw) this.user.raw = config.user;
      }
    }
  }

  get fullstatus() {
    if(this.substatus) return this.status + ' - ' + this.substatus;
    return this.status;
  }

  get _id() {
    return this.id();
  }

}
