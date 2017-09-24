'use strict';
import couchdb from 'couchdb-promises';

import config from '../config';
import contentDirWatcher from './contentDirWatcher';
import dbWatcher from './dbWatcher';

const db = couchdb({ baseUrl: config.couchDbUrl });

export default async(socket, serialPort) => {
	contentDirWatcher(db);
	await dbWatcher(db, socket, serialPort);
};
