const conf = require(__dirname + '/conf');

function commandSplit(com) {
  let command1, command2, command3;
  let commandEx = [];

  if (!com && com.indexOf(' ') == -1) {
    return false;
  }
  command1 = com.slice(0, com.indexOf(' '));
  com = com.replace(command1, '');

  if (com.match(/['"]([^'"]+)['"]/)) {
    command2 = com.match(/['"]([^'"]+)['"]/)[1];
    com = com.replace(command2, '');
    com = com.replace('\'','').replace('\'','').replace('"','').replace('"','');

  } else {
    command2 = com.split(' ', 2)[1];
    com = com.replace(command2, '');
  }

  command3 = com.trim();

  commandEx = [command1, command2, command3];

  return commandEx;
}

module.exports = function() {
  return commandSplit;
};
