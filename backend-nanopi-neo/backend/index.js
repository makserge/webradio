require('babel-polyfill');
require('babel-register');

require('events').EventEmitter.defaultMaxListeners = 0;

const config = require('./config');

const app = require('./app').default;

app.listen(config.port);
/* eslint no-console: ["error", { allow: ["log"] }] */
console.log('Listening on port ', config.port);
