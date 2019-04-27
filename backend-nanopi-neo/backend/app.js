import Koa from 'koa';
import SerialPort from 'serialport';
import mqtt from 'mqtt';

import config from './config';
import constants from './constants';
import socketIo from './socketIo';
import watcher from './watcher/index';
import serialController from './controller/serialController';

const app = new Koa();
const socket = socketIo(app);
const port = new SerialPort(config.serialPort, {
  baudRate: config.serialPortBaudRate,
});

const serial = new serialController(port, constants.serialSendDelimiter);

const mqttClient = mqtt.connect({
  host: config.mqttHost,
  port: config.mqttPort,
  username: config.mqttUsername,
  password: config.mqttPassword,
});

watcher(socket, serial, mqttClient);

export default app;
