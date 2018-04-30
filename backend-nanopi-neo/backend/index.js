require('events').EventEmitter.defaultMaxListeners = 0;

const config = require('./config');

const app = require('./app').default;

app.listen(config.port);
console.log("Listening on port " + config.port);
