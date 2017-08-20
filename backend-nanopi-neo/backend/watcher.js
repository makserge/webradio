'use strict';
import chokidar from 'chokidar';
import Queue from 'better-queue';
import fs from 'fs';
import path from 'path';
import follow from 'follow';

import config from './config';
import constants from './constants';
import mediaController from './mediaController';
import couchdb from 'couchdb-promises';

const db = couchdb({ baseUrl: config.couchDbUrl });

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

const getState = async(dbName) => {
	let state = {};

	try {
		const doc = await db.getDocument(dbName, constants.dbDocumentAppState);
		if (doc.data[constants.dbFieldState]) {
			state = doc.data[constants.dbFieldState];
		}
	}
	catch(e) {
		state[constants.dbStatusPower] = false;
		state[constants.dbStatusSelectedWebRadioId] = 1;
	}
	return state;
}	

const playSelected = async(socket, dbName, mode) => {
	if (mode === constants.modeWebRadio) {
		const state = await getState(dbName);
		const selectedId = state[constants.dbStatusSelectedWebRadioId];
		console.log('modeWebRadio', selectedId);
		mediaController.playWebRadioItem(selectedId, socket);
	}	
}	

const initAppStateChangesWatcher = async(dbUrl, dbName, socket) => {
	const state = await getState(dbName);

    dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAppState, (result) => {
		const newState = result.doc[constants.dbFieldState];

		checkDbFieldChanges(constants.dbStatusPower, state, newState, (result) => {
			console.log(constants.dbStatusPower, result);
		});

		checkDbFieldChanges(constants.dbStatusSelectedWebRadioId, state, newState, (result) => {
			mediaController.playWebRadioItem(result, socket);
		});
    });
}

const initModeChangesWatcher = async(dbUrl, dbName, socket) => {
	let mode;

	try {
		const doc = await db.getDocument(dbName, constants.dbDocumentNavigation);
		if (doc.data[constants.dbFieldState]) {
			mode = doc.data[constants.dbFieldState][constants.dbFieldRoutes][0][constants.dbFieldIndex];
		}
	}
	catch(e) {
	}
    dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentNavigation, (result) => {
		const newMode = result.doc[constants.dbFieldState][constants.dbFieldRoutes][0][constants.dbFieldIndex];
		if (newMode != mode) {
			mode = newMode;
			console.log('mode', newMode);
			mediaController.stop();
			playSelected(socket, dbName, mode);
		}	
    });
}	

const initDbChangesWatcher = async(dbUrl, dbName, socket) => {
    await initAppStateChangesWatcher(dbUrl, dbName, socket);
	await initModeChangesWatcher(dbUrl, dbName, socket);
}

const watcher = {
	init(socket) {
		initContentDirWatcher(config.couchDbName);

		initDbChangesWatcher(config.couchDbUrl, config.couchDbName, socket);
	}
};

module.exports = watcher;
