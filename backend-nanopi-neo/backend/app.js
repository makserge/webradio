'use strict';
import Koa from 'koa';
import SerialPort from 'serialport';

import config from './config';
import socketIo from './socketIo';
import watcher from './watcher/index';

const app = new Koa();
const socket = socketIo(app);
const port = new SerialPort(config.serialPort, {
  baudRate: config.serialPortBaudRate
});
watcher(socket, port);

export default app;
