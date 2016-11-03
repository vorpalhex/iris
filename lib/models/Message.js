const uuid = require('uuid');

module.exports = class Message {
  constructor(config) {
    this.contents = config.contents || '';
    this.user = config.user || {};
    this.interface = config.interface || '';
    this.raw = config.raw || null;
    this.mentions = config.mentions || {};
    this.respond = config.respond || function(cb){ if(cb) return cb(new Error('No respond setup')) };
    this.type = 'Message';
    this.timestamp = Date.now();
    this.id = uuid.v4();
  }

  get _id(){
    return this.id;
  }
}
