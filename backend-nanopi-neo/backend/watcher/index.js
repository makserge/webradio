import couchdb from 'couchdb-promises';

import config from '../config';
import dbWatcher from './dbWatcher';
import serialPortWatcher from './serialPortWatcher';
import mqttWatcher from './mqttWatcher';
import sendInitialData from './sendInitialData';
import setInitialDBData from './setInitialDBData';

const db = couchdb({ baseUrl: config.couchDbUrl });

export default async function (socket, serialPort, mqttClient) {
  mqttWatcher(db, mqttClient);
  setInitialDBData(db, config.couchDbName);
  await dbWatcher(db, socket, serialPort, mqttClient);
  serialPortWatcher(db, serialPort);
  sendInitialData(db, config.couchDbName, serialPort);
}
