const PouchDB = require('pouchdb');
const db = new PouchDB(__dirname + '/../../storage/pouch.db');

module.exports = {
  put: db.put,
  get: db.get,
  query: db.query,
  remove: db.remove,
  raw: db
};
