const interfaces = require(__dirname + '/../interfaces');
const log = require(__dirname + '/../util/log')();
const Promise = require('bluebird');

function connect(interfaceName){
  return new Promise( (resolve, reject)=> {
    let myInterface = interfaces[interfaceName];

    if(myInterface.connect) myInterface.connect((err, success)=>{
      if(err) {
        log.warn(`Failed to connect to ${interfaceName}`, err);
        return reject(err);
      }

      log.info(`Connected to ${interfaceName}`);
      return resolve(success);
    });

    return reject(new Error(`No such interface ${interfaceName}`));
  });
}

function disconnect(interfaceName){
  return new Promise( (resolve, reject)=> {
    let myInterface = interfaces[interfaceName];

    if(myInterface.disconnect) myInterface.disconnect((err, success)=>{
      if(err) {
        log.warn(`Failed to disconnect to ${interfaceName}`, err);
        return reject(err);
      }

      log.info(`Disconnected from ${interfaceName}`);
      return resolve(success);
    });

    return reject(new Error(`No such interface ${interfaceName}`));
  });
}

function connectAll(){
  let connectables = [];
  for(let interfaceName in interfaces) {
    connectables.push(connect(interfaceName));
  }
  return Promise.all(connectables);
}

function disconnectAll(){
  let connectables = [];
  for(let interfaceName in interfaces) {
    connectables.push(disconnect(interfaceName));
  }
  return Promise.all(connectables);
}

function reconnect(interfaceName) {
  return disconnect(interfaceName)
  .then(()=>console.log('Disconnected'))
  .delay(500)
  .then(()=>console.log('Delayed'))
  .then(()=>connect(interfaceName))
  .then(()=>console.log('Connecting'));
}

function reconnectAll() {
  return disconnectAll().delay(500).then(connectAll);
}

function status(){

}

module.exports = {
  connect, disconnect, connectAll, disconnectAll, reconnect, reconnectAll, status
}
