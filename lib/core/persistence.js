const PouchDB = require('pouchdb-node');
const db = new PouchDB('storage', {adapter: 'leveldb'});

module.exports = db;
