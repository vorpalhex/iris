const store = require(__dirname + '/../storage/durable');

module.exports = class User {
  constructor(config) {
    this.raw = config.raw || {};
    this.interface = config.interface || '';
    this.interfaceId = config.interfaceId || '';
    this.email = config.email || '';
    this.displayName = config.displayName || '';
    this.type = 'User';
    this.timestamp = Date.now();
  }

  get _id() {
    return this.interface + ':' + this.interfaceId
  }

  save(cb) {
    return store.put(this, cb);
  }

  load(cb) {
    return store.get(this._id, cb);
  }
}
