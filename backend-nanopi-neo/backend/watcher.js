'use strict';
import chokidar from 'chokidar';
import Queue from 'better-queue';
import fs from 'fs';
import path from 'path';
import follow from 'follow';
import couchdb from 'couchdb-promises';
import { load } from 'crontab';

import config from './config';
import constants from './constants';
import mediaController from './mediaController';

const db = couchdb({ baseUrl: config.couchDbUrl });

const walkContentFoldersTree = (dir, isCancelled) => {
  const walk = (entry, isCancelled, isTop) => {
    return new Promise((resolve, reject) => {
		if (isCancelled) {
			return resolve({});
		}
		fs.exists(entry, exists => {
			if (!exists) {
				return reject(`Path ${entry} is not exists`);
			}
			return resolve(new Promise((resolve, reject) => {
				fs.lstat(entry, (err, stats) => {
					if (err) {
						return reject(err);
					}
					if (stats.isFile()) {
						return resolve({
							title: '',
						});
					}
					resolve(new Promise((resolve, reject) => {
						fs.readdir(entry, (err, files) => {
							if (err) {
								return reject(err);
							}
							Promise.all(files.map(child => walk(path.join(entry, child), isCancelled, false))).then(children => {
								children = children.filter(item => item.title !== '');
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
		persistent: true,
		followSymlinks: true
    });

	const queue = new Queue(
		async function () {
			let isCancelled = false;
			let folderTree = [];
			try {
				folderTree = await walkContentFoldersTree(config.contentDir, isCancelled);
				if (!isCancelled) {
					const doc = await db.getDocument(dbName, constants.dbDocumentContentDirTree);
						if (doc.data) {
							folderTree._rev = doc.data._rev;
						}
					}
			}
			catch(e) {
				console.log(e);
			}
			await db.createDocument(dbName, folderTree, constants.dbDocumentContentDirTree);
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
		state[constants.dbStatusSelectedAudioPlayListId] = 0;
		state[constants.dbStatusSelectedAudioTrackId] = 0;
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
	else if (mode === constants.modeAudioPlayer) {
		const state = await getState(dbName);
		const selectedPlaylistId = state[constants.dbStatusSelectedAudioPlayListId];
		const selectedTrackId = state[constants.dbStatusSelectedAudioTrackId];
		console.log('modeAudioPlayer', selectedPlaylistId, selectedTrackId);
		await mediaController.playAudioPlaylistItem(selectedPlaylistId, false);
		mediaController.playAudioTrackItem(selectedTrackId, socket, false);
	}
}

const getObjectDiff = (obj1, obj2, titleField, valueField) => {
	let diff;

	const ids1 = obj1.map(item => item.id);
	const ids2 = obj2.map(item => item.id);

	diff = ids2.map((id, index) => {
		if (ids1.indexOf(id) < 0) {
			return { action: 'add', item: obj2[index] };
		}
	}).filter(item => item != undefined);
	if (diff.length === 0) {
		diff = ids1.map((id, index) => {
			if (ids2.indexOf(id) < 0) {
				return { action: 'delete', item: obj1[index] };
			}
		}).filter(item => item != undefined);
	}
	if (diff.length === 0) {
		diff = ids1.map((id, index) => {
			const item1 = obj1[index];
			const item2 = obj2[index];
			if (item1[valueField] !== item2[valueField]) {
				return { action: 'rescan', item: obj2[index] };
			}
		})
		.filter(item => item != undefined);
	}
	return diff;
}

const updateAlarms = (data) => {
  console.log('updateAlarms');
  load((err, crontab) => {
    for (const item of data) {
      const onComment = `alarm ${item.id} on`;
      const offComment = `alarm ${item.id} off`;
      crontab.remove({ comment: onComment });
      crontab.remove({ comment: offComment });
      if (item.enabled) {
        const onCommand = `${config.alarmOnScriptPath} ${item.volume} ${item.presetType} ${item.preset}`;
        const weekDays = item.days.join(',');
        const time = `${item.min} ${item.hour} * * ${weekDays}`;
        console.log (time, ' ', onCommand, ' ', onComment);
        crontab.create(onCommand, time, onComment);

        const onDate = new Date(1970, 0, 1, parseInt(item.hour), parseInt(item.min));
        const offDate = new Date(onDate.getTime());
        offDate.setTime(onDate.getTime() + item.timeout * 60 * 1000);
        const offTime = `${offDate.getMinutes()} ${offDate.getHours()} * * ${weekDays}`;
        const offCommand = config.alarmOffScriptPath;
        console.log (offTime, ' ', offCommand, ' ', offComment);
        crontab.create(offCommand, offTime, offComment);
      }
    }
    crontab.save(function(err, crontab) {
      if (err) {
        console.log(err)
      }
    });
  });
}

const initAppStateChangesWatcher = async(dbUrl, dbName, socket) => {
	let state = await getState(dbName);

  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAppState, (result) => {
	  const newState = result.doc[constants.dbFieldState];

	  checkDbFieldChanges(constants.dbStatusPower, state, newState, (result) => {
	      console.log(constants.dbStatusPower, result);
			  state = newState;
		 });

		checkDbFieldChanges(constants.dbStatusSelectedWebRadioId, state, newState, (result) => {
			mediaController.playWebRadioItem(result, socket);
			state = newState;
		});

		checkDbFieldChanges(constants.dbStatusSelectedAudioPlayListId, state, newState, (result) => {
			mediaController.playAudioPlaylistItem(result, false);
			mediaController.playAudioTrackItem(1, socket, true);
			state = newState;
		});

		checkDbFieldChanges(constants.dbStatusSelectedAudioTrackId, state, newState, (result) => {
			mediaController.playAudioTrackItem(result, socket, false);
			state = newState;
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

const initAudioPlayListWatcher = async(dbUrl, dbName, socket) => {
	let state = {};

	try {
		const doc = await db.getDocument(dbName, constants.dbDocumentAudioPlaylist);
		if (doc.data[constants.dbFieldState]) {
			state = doc.data[constants.dbFieldState];
		}
	}
	catch(e) {
	}
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAudioPlaylist, async(result) => {
		const newState = result.doc[constants.dbFieldState];
		const changedObjects = getObjectDiff(state, newState, constants.dbFieldTitle, constants.dbFieldValue);
		for (let item of changedObjects) {
			const id = item.item[constants.dbId];
			const path = item.item[constants.dbFieldValue];
			if (item.action === 'add') {
				await mediaController.addPlaylist(id);
				await mediaController.rescanPlaylist(id, path);
				await mediaController.playAudioPlaylistItem(id, true);
				mediaController.playAudioTrackItem(1, socket, true);
			}
			else if (item.action === 'delete') {
				mediaController.stop();
				await mediaController.deletePlaylist(id);
			}
			else if (item.action === 'rescan') {
				mediaController.stop();
				await mediaController.rescanPlaylist(id, path);
			}
		}
		state = newState;
  });
}

const initAlarmChangesWatcher = async(dbUrl, dbName) => {
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAlarm, (result) => {
      const newState = result.doc[constants.dbFieldState];
      updateAlarms(newState);
		}
  )
}

const initDbChangesWatcher = async(dbUrl, dbName, socket) => {
  await initAppStateChangesWatcher(dbUrl, dbName, socket);
	await initModeChangesWatcher(dbUrl, dbName, socket);
	await initAudioPlayListWatcher(dbUrl, dbName, socket);
  await initAlarmChangesWatcher(dbUrl, dbName);
}

const watcher = {
	init(socket) {
	   initContentDirWatcher(config.couchDbName);
	   initDbChangesWatcher(config.couchDbUrl, config.couchDbName, socket);
	}
};

module.exports = watcher;
