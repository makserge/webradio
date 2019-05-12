import Koa from 'koa';
import mqtt from 'mqtt';

import config from './config';
import socketIo from './socketIo';
import startWatcher from './watcher';
import SerialController from './controller/serialController';

const app = new Koa();
const socket = socketIo(app);

const serial = new SerialController();

const mqttClient = mqtt.connect({
  host: config.mqttHost,
  port: config.mqttPort,
  username: config.mqttUsername,
  password: config.mqttPassword,
});

startWatcher(socket, serial, mqttClient);

export default app;
