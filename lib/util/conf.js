"use strict";
const cjson = require('cjson');

let conf = cjson.load(__dirname + '/../../config/config.json');

module.exports = conf;
