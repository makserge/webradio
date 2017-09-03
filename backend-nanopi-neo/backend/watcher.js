'use strict';
import couchdb from 'couchdb-promises';

import config from './config';
import contentDirWatcher from './contentDirWatcher';
import dbWatcher from './dbWatcher';

const db = couchdb({ baseUrl: config.couchDbUrl });

const watcher = {
	init(socket) {
	   contentDirWatcher.init(db);
	   dbWatcher.init(db, socket);
	}
};

module.exports = watcher;
