import couchdb from 'couchdb-promises';

import config from '../config';
// import contentDirWatcher from './contentDirWatcher';
import dbWatcher from './dbWatcher';
import serialPortWatcher from './serialPortWatcher';
import mqttWatcher from './mqttWatcher';
import sendInitialData from './sendInitialData';

const db = couchdb({ baseUrl: config.couchDbUrl });

export default async function (socket, serialPort, mqttClient) {
  mqttWatcher(db, mqttClient);
  // contentDirWatcher(db);
  await dbWatcher(db, socket, serialPort, mqttClient);
  serialPortWatcher(db, serialPort);
  sendInitialData(db, config.couchDbName, serialPort);
}
