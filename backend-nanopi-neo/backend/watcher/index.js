import dbClient from 'nano';

import config from '../config';
import dbWatcher from './dbWatcher';
import serialPortWatcher from './serialPortWatcher';
import mqttWatcher from './mqttWatcher';
import sendInitialData from './sendInitialData';
import setInitialDBData from './setInitialDBData';

export default async function (socket, serialController, mqttClient) {
  const nano = dbClient(config.couchDbUrl);
  const db = nano.use(config.couchDbName);

  mqttWatcher(db, mqttClient);
  setInitialDBData(db);
  await dbWatcher(db, socket, serialController, mqttClient);
  serialPortWatcher(db, socket, serialController, mqttClient);
  sendInitialData(db, serialController);
}
