const requiredir = require('require-dir');

const log = require(__dirname + '/../util/log')();
let interfaces = requiredir(__dirname + '/../interfaces');

module.exports = {
  connect: ()=>{
    for(let interfaceName in interfaces) {
      let interface = interfaces[interfaceName];

      if(interface.connect) interface.connect((err, success)=>{
        if(err) {
          log.warn(`Failed to connect to ${interfaceName}`, err);
          return;
        }
        log.info(`Connected to ${interfaceName}`)
      });
    }
  }
}
