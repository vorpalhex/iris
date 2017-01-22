const interfaces = require(__dirname + '/../interfaces');

function connect(interface){
  let myInterface = interfaces[interfaceName];

  if(myInterface.connect) myInterface.connect((err, success)=>{
    if(err) {
      log.warn(`Failed to connect to ${interfaceName}`, err);
      return;
    }

    log.info(`Connected to ${interfaceName}`);
  });
}

function disconnect(interface){
  let myInterface = interfaces[interfaceName];

  if(myInterface.disconnect) myInterface.disconnect((err, success)=>{
    if(err) {
      log.warn(`Failed to disconnect to ${interfaceName}`, err);
      return;
    }

    log.info(`Disconnected from ${interfaceName}`);
  });
}

function connectAll(){
  for(let interfaceName in interfaces) {
    connect(interfaceName);
  }
}

function disconnectAll(){
  for(let interfaceName in interfaces) {
    disconnect(interfaceName);
  }
}

function status(){

}

module.exports = {
  connect, disconnect, connectAll, disconnectAll, status
}
