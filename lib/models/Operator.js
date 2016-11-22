const uuid = require('uuid');

const store = require(__dirname + '/../storage/durable')('operators');

module.exports = class Operator {
  constructor(config) {
    this.name = config.name || '';
    this.email = config.email || '';
    this.isAdmin = config.isAdmin || false;
    this.profiles = config.profiles || [];
    this.type = 'Operator';
    this.timestamp = Date.now();
    this.id = config.id || this._id;
  }

  get _id() {
    return this.name + '|' + this.email;
  }

  save() {
    return store.update(this);
  }

  load() {
    return store.find({id: this.id});
  }
}
