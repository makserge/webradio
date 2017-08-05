'use strict';
import chokidar from 'chokidar';
import Queue from 'better-queue';
import fs from 'fs';
import path from 'path';
import follow from 'follow';

import config from './config';
import constants from './constants';

const db = require('couchdb-promises')({
  baseUrl: config.couchDbUrl,
  requestTimeout: 10000
})

const walkTree = (dir, isCancelled) => {
  const walk = (entry, isCancelled, isTop) => {
    return new Promise((resolve, reject) => {
		if (isCancelled) {
			return resolve({});
		}
		fs.exists(entry, exists => {
			if (!exists) {
				return resolve({});
			}
			return resolve(new Promise((resolve, reject) => {
				fs.lstat(entry, (err, stats) => {
					if (err) {
						return reject(err);
					}
					if (!stats.isDirectory()) {
						return resolve({
							title: path.basename(entry),
						});
					}
					resolve(new Promise((resolve, reject) => {
						fs.readdir(entry, (err, files) => {
							if (err) {
								return reject(err);
							}
							Promise.all(files.map(child => walk(path.join(entry, child), isCancelled, false))).then(children => {
								resolve(isTop ?
									{
										madeBy: 'watcher',
										state: children
									}
									:
									{
										title: path.basename(entry),
										children: children
									}
								);
							}).catch(err => {
								reject(err);
							});
						});
					}));
				});
			}));
		});
    });
  }
  return walk(dir, isCancelled, true);
};

const initContentDirWatcher = (dbName) => {
	const watcher = chokidar.watch(config.contentDir, {
		ignored: /(^|[\/\\])\../,
		persistent: true
    });

	const queue = new Queue(
		async function () {
			let isCancelled = false;
			let folderTree = await walkTree(config.contentDir, isCancelled);
			if (!isCancelled) {
				try {
					const doc = await db.getDocument(dbName, constants.dbDocumentContentDirTree);
					if (doc.data) {
						folderTree._rev = doc.data._rev;
					}
				}
				catch(e) {
				}
				await db.createDocument(dbName, folderTree, constants.dbDocumentContentDirTree);
			}
			return {
				cancel: () => {
					isCancelled = true;
				}
			}
		},
		{ id: 'id', cancelIfRunning: true }
	);

	let isInit = false;

    watcher
		.on('ready', () => { isInit = true; queue.push({ id: 'scanDir' }); })
		.on('addDir', () => { if (isInit) queue.push({ id: 'scanDir' }); })
		.on('unlinkDir', () => { if (isInit) queue.push({ id: 'scanDir' }); });
};

const dbDocumentWatcher = (dbUrl, dbName, documentId, changeCallback) => {
    const params = {
		db: dbUrl + '/' + dbName,
		since: 'now',
		include_docs: true,
		filter: (doc, req) => {
			return (doc._id == documentId);
		}
	};
	const feed = new follow.Feed(params);
    feed.follow();

    feed.on('change', (change) => {
		changeCallback(change);
	});
};

const checkDbFieldChanges = (field, state, newState, changeCallback) => {
	const newValue = newState[field];
	if (newValue != state[field]) {
		state[field] = newValue;
		changeCallback(newValue);
	}	
};

async function initAppStateChangesWatcher(dbUrl, dbName) {
	let state = {};
	state[constants.dbStatusPower] = false;
	state[constants.dbStatusSelectedWebRadioId] = 0;
	
	try {
		const doc = await db.getDocument(dbName, constants.dbDocumentAppState);
		if (doc.body) {
			state = doc.body;
		}
	}
	catch(e) {
	}
	
    dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAppState, (result) => {
		const newState = result.doc[constants.dbFieldState];
	  
		checkDbFieldChanges(constants.dbStatusPower, state, newState, (result) => {
			console.log(constants.dbStatusPower, result);
		});
		
		checkDbFieldChanges(constants.dbStatusSelectedWebRadioId, state, newState, (result) => {
			console.log(constants.dbStatusSelectedWebRadioId, result);
		});
    });
}

async function initDbChangesWatcher(dbUrl, dbName) {
    await initAppStateChangesWatcher(dbUrl, dbName);
}

const watcher = {
	init() {
		initContentDirWatcher(config.couchDbName);

		initDbChangesWatcher(config.couchDbUrl, config.couchDbName);
	}
};

module.exports = watcher;
