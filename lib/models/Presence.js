var User = require('./User');

module.exports = class Presence {
  constructor(config) {
    this.status = config.status || 'online';
    this.user = {};
    this.raw = config.raw || {};
    this.interface = config.interface || '';
    this.substatus = config.substatus || '';

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
  
}