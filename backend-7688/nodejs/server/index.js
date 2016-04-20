'use strict';
let koa = require('koa');
let serve = require('koa-static-folder');
let cors = require('kcors');
let config = require('./config');
let router = require('./router');

let app = koa();
app.use(serve(config.imagedir));
app.use(cors());
app.use(router.routes());

app.listen(config.port);
console.log("Listening on port " + config.port);