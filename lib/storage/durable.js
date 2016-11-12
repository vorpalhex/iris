const loki = require('lokijs');
const adapter = new loki.persistenceAdapters.fs();
const db = new loki(__dirname + '/../../storage/iris.json', {autosave: true, autosaveInterval: 5000, autoload: true, adapter: adapter});

module.exports = function(collectionName) {
  let coll = db.getCollection(collectionName);
  if(coll) return coll;
  return db.addCollection(collectionName);
}
