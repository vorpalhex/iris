const uuid = require('uuid');

const store = require(__dirname + '/../storage/durable')('operators');

module.exports = class User {
  constructor(config) {
    this.id = config.id || this._id;
    this.name = config.name || '';
    this.email = config.email || '';
    this.isAdmin = config.isAdmin || false;
    this.profiles = config.profiles || [];
    this.type = 'Operator';
    this.timestamp = Date.now();
  }

  get _id() {
    return uuid.v4();
  }

  save() {
    return store.insert(this);
  }

  load() {
    return store.find({_id: this._id});
  }
}
