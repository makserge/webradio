'use strict';
let koa = require('koa');
var cors = require('kcors');
let config = require('./config');
let router = require('./router');

let app = koa();
app.use(cors());
app.use(router.routes());

app.listen(config.port);
console.log("Listening on port " + config.port);