'use strict';
import Koa from 'koa';
//import cors from 'kcors';
//import convert from 'koa-convert';
//import body from 'koa-json-body';
//import serve from 'koa-static2';
import SerialPort from 'serialport';
//import fs from 'fs';
//import path from 'path';

import config from './config';

import socketIo from './socketIo';

//import router from './router';
//import processor from './processor';
import watcher from './watcher/index';

const app = new Koa();
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: config.serialPortDelimiter
});

const serialPort = new SerialPort(config.serialPort, {
  baudRate: config.serialPortBaudRate
});

const socket = socketIo(app);

serialPort.pipe(parser);
//port.on('open', () => console.log('Port ' + config.serialPort + ' was opened'));
//parser.on('data', async (data) => {
//	await processor.processSerialData(socket, data);
//});

watcher(socket, serialPort);

//app.use(ctx => {
//  ctx.type = 'text/html'
//  ctx.body = fs.createReadStream( path.join( __dirname, 'index.html' ) )
//})

//app.use(convert(cors()))
//  .use(body())
//  .use(serve(config.imageDir))
//  .use(router.routes())
//  .use(router.allowedMethods());

export default app;
