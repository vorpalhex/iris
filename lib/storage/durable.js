const loki = require('lokijs');
const fs = require('fs');

const dbFile = __dirname + '/../../storage/iris.json'

const db = new loki();

module.exports = function(collectionName) {
  let coll = db.getCollection(collectionName);
  if(coll) return coll;
  return db.addCollection(collectionName);
}

try {
  let oldDB = fs.readFileSync(dbFile, {encoding: 'utf8'});
  db.loadJSON(oldDB);
} catch(e){
  console.log('Failed to load old DB', e);
}

setInterval(()=>{
  if(!db.autosaveDirty()) return;
  let contents = db.serialize();
  fs.writeFile(dbFile, contents, {encoding: 'utf8'}, (err, success)=>{
    if(err) return console.log('Error saving DB', err);
    db.autosaveClearFlags();
  });
}, 5000)
