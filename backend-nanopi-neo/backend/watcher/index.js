'use strict';
import couchdb from 'couchdb-promises';

import config from '../config';
import contentDirWatcher from './contentDirWatcher';
import dbWatcher from './dbWatcher';
import serialPortWatcher from './serialPortWatcher';
import mqttWatcher from './mqttWatcher';
import sendInitialData from './sendInitialData';

const db = couchdb({ baseUrl: config.couchDbUrl });

export default async(socket, serialPort) => {
	contentDirWatcher(db);
	await dbWatcher(db, socket, serialPort);
	serialPortWatcher(db, serialPort);
	mqttWatcher(db);
	sendInitialData(db, config.couchDbName, serialPort);
};
