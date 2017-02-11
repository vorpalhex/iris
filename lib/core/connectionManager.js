const interfaces = require(__dirname + '/../interfaces');
const log = require(__dirname + '/../util/log')();
const Promise = require('bluebird');

const interfaceState = {};

const states = {
  DISCONNECTED: 'DISCONNECTED',
  CONNECTED: 'CONNECTED'
};

for (let interfaceName in interfaces) {
  interfaceState[interfaceName] = states.DISCONNECTED;
}

function connect(interfaceName){
  return new Promise( (resolve, reject)=> {
    let myInterface = interfaces[interfaceName];
    if(myInterface.connect && interfaceState[interfaceName] === states.DISCONNECTED) {
      log.info(`Connecting to ${interfaceName}`);
      myInterface.connect((err, success)=>{
        if(err) {
          log.warn(`Failed to connect to ${interfaceName}`, err);
          return reject(err);
        }
        interfaceState[interfaceName] = states.CONNECTED;
        log.info(`Connected to ${interfaceName}`);

        return resolve(success);
      });
    } else {
      return reject(new Error(`No such interface ${interfaceName}`));
    }

  });
}

function reconnectInterface(interfaceName){
  return new Promise( (resolve, reject)=> {
    let myInterface = interfaces[interfaceName];
    if(myInterface.reconnect && interfaceState[interfaceName] === states.DISCONNECTED) {
      myInterface.reconnect((err, success)=>{
        if(err) {
          log.warn(`Failed to reconnect to ${interfaceName}`, err);
          return reject(err);
        }
        interfaceState[interfaceName] = states.CONNECTED;
        log.info(`Reconnected to ${interfaceName}`);

        return resolve(success);
      });
    } else {
      return reject(new Error(`No such interface ${interfaceName}`));
    }

  });
}

function disconnect(interfaceName){
  return new Promise( (resolve, reject)=> {
    let myInterface = interfaces[interfaceName];

    if(myInterface.disconnect) {
      log.info(`Disconnecting from ${interfaceName}`);
      myInterface.disconnect((err, success)=>{
        interfaceState[interfaceName] = states.DISCONNECTED;
        return resolve();
      });
    }else {
      return reject(new Error(`No such interface ${interfaceName}`));
    }

  });
}

function connectAll(){
  let connectables = [];
  for(let interfaceName in interfaces) {
    connectables.push(connect(interfaceName));
  }
  return Promise.all(connectables);
}

function reconnectAllInterfaces(){
  let connectables = [];
  for(let interfaceName in interfaces) {
    connectables.push(reconnect(interfaceName));
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
  .delay(2000)
  .then(()=>reconnectInterface(interfaceName))
}

function reconnectAll() {
  return disconnectAll().delay(2000).then(reconnectAllInterfaces);
}

function status(){
  return interfaceState;
}

module.exports = {
  connect, disconnect, connectAll, disconnectAll, reconnect, reconnectAll, status
}
