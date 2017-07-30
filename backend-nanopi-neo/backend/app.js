'use strict';
import Koa from 'koa';
import cors from 'kcors';
import convert from 'koa-convert';
import body from 'koa-json-body';
import serve from 'koa-static2';
import IO from 'koa-socket';
import SerialPort from 'serialport';
import fs from 'fs';
import path from 'path';

import config from './config';
import router from './router';
import processor from './processor';
import watcher from './watcher';

const app = new Koa();
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: config.serialPortDelimiter
});

const port = new SerialPort(config.serialPort, {
  baudRate: config.serialPortBaudRate
});

const socket = new IO();
socket.attach(app);

socket.on('connection', async (ctx) => {
  console.log( 'Connect socket', ctx.socket.id )
  ctx.socket.emit('status', {data: await processor.getInitialStatus()});
});

socket.on( 'disconnect', ctx => {
  console.log( 'Disconnect socket', ctx.socket.id )
});

socket.on( 'data', ( ctx, data ) => {
  console.log( 'data event', data )
  ctx.socket.emit( 'response', {
    message: 'response from server'
  })
})

port.pipe(parser);
port.on('open', () => console.log('Port ' + config.serialPort + ' was opened'));
parser.on('data', async (data) => {
	await processor.processSerialData(socket, data);
});

watcher.init();

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
