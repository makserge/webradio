'use strict';
let koa = require('koa');
let serve = require('koa-static-folder');
let cors = require('kcors');
let body = require('koa-parse-json');
let config = require('./config');
let router = require('./router');

let app = koa();
app.use(cors({ origin: '*' }));
app.use(body());
app.use(serve(config.imagedir));
app.use(router.routes());

app.listen(config.port);
console.log("Listening on port " + config.port);