'use strict';

require('events').EventEmitter.defaultMaxListeners = 0;
require('babel-polyfill');
require('babel-register');

const config = require('./config');

const app = require('./app').default;
app.listen(config.port);
console.log("Listening on port " + config.port);