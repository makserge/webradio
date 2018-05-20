import Koa from 'koa';
import SerialPort from 'serialport';
import mqtt from 'mqtt';

import config from './config';
import socketIo from './socketIo';
import watcher from './watcher/index';

const app = new Koa();
const socket = socketIo(app);
const port = new SerialPort(config.serialPort, {
  baudRate: config.serialPortBaudRate,
});

const mqttClient = mqtt.connect({
  host: config.mqttHost,
  port: config.mqttPort,
  username: config.mqttUsername,
  password: config.mqttPassword,
});

watcher(socket, port, mqttClient);

export default app;
