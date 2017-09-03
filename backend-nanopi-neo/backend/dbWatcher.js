import follow from 'follow';
import { load } from 'crontab';

import config from './config';
import constants from './constants';
import mediaController from './mediaController';

const SLEEP_TIMER_DELAY = 60 * 1000;
let sleepTimer;

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

const getState = async(db, dbName) => {
	let state = {};

	try {
		const doc = await db.getDocument(dbName, constants.dbDocumentAppState);
		if (doc.data[constants.dbFieldState]) {
			state = doc.data[constants.dbFieldState];
		}
	}
	catch(e) {
		state[constants.dbStatusPower] = false;
    state[constants.dbStatusSleepTimerOn] = false;
		state[constants.dbStatusSelectedWebRadioId] = 1;
		state[constants.dbStatusSelectedAudioPlayListId] = 0;
		state[constants.dbStatusSelectedAudioTrackId] = 0;
	}
	return state;
}

const playSelected = async(socket, db, dbName, mode) => {
	if (mode === constants.modeWebRadio) {
		const state = await getState(db, dbName);
		const selectedId = state[constants.dbStatusSelectedWebRadioId];
		console.log('modeWebRadio', selectedId);
		mediaController.playWebRadioItem(selectedId, socket);
	}
	else if (mode === constants.modeAudioPlayer) {
		const state = await getState(db, dbName);
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
        console.log(offTime, ' ', offCommand, ' ', offComment);
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

const updateSleepTimer = (enabled, value, socket, onSleepTimerFinished) => {
  if (sleepTimer) {
    clearTimeout(sleepTimer);
  }
  if (enabled) {
    let timeout = value;
    sendSleepTimerInfo(socket, timeout);
    sleepTimer = setInterval(() => {
      timeout--;
      sendSleepTimerInfo(socket, timeout);
      if (timeout === 0) {
        clearInterval(sleepTimer);
        onSleepTimerFinished();
      }
    }, SLEEP_TIMER_DELAY);
  } else {
    sendSleepTimerInfo(socket, 0);
  }
};

const sendSleepTimerInfo = (socket, remaining) => {
  if (socket.connections.size) {
    const data = {
      remaining
    };
    console.log(constants.socketSleepTimer, data)
    socket.broadcast(constants.socketSleepTimer, data);
  }
}

const onSleepTimerFinished = async(db) => {
  console.log('onSleepTimerFinished');
  let appState = { madeBy: 'dbWatcher' };
  try {
    const doc = await db.getDocument(config.couchDbName, constants.dbDocumentAppState);
    if (doc.data[constants.dbFieldState]) {
      appState._rev = doc.data._rev;
      appState[constants.dbFieldState] = doc.data[constants.dbFieldState];
    }
    appState[constants.dbFieldState][constants.dbStatusSleepTimerOn] = false;
    appState[constants.dbFieldState][constants.dbStatusPower] = false;
    await db.createDocument(config.couchDbName, appState, constants.dbDocumentAppState);
  }
  catch(e) {
  }
}

const setSleepTimer = async(db, enabled) => {
  let appState = { madeBy: 'dbWatcher' };
  try {
    const doc = await db.getDocument(config.couchDbName, constants.dbDocumentAppState);
    if (doc.data[constants.dbFieldState]) {
      appState._rev = doc.data._rev;
      appState[constants.dbFieldState] = doc.data[constants.dbFieldState];
    }
    appState[constants.dbFieldState][constants.dbStatusSleepTimerOn] = enabled;
    await db.createDocument(config.couchDbName, appState, constants.dbDocumentAppState);
  }
  catch(e) {
    console.log(e);
  }
}

const initAppStateChangesWatcher = async(db, dbUrl, dbName, socket) => {
	let state = await getState(db, dbName);

  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAppState, (result) => {
	  const newState = result.doc[constants.dbFieldState];

	  checkDbFieldChanges(constants.dbStatusPower, state, newState, (result) => {
	    console.log(constants.dbStatusPower, result);
      if (!result) {
        setSleepTimer(db, false);
      }
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

    checkDbFieldChanges(constants.dbStatusSleepTimerOn, state, newState, (result) => {
	    console.log(constants.dbStatusSleepTimerOn, result);
      updateSleepTimer(result, newState[constants.dbStatusSleepTimer], socket, () => onSleepTimerFinished(db));
			state = newState;
		});
  });
}

const initModeChangesWatcher = async(db, dbUrl, dbName, socket) => {
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
			playSelected(socket, db, dbName, mode);
		}
  });
}

const initAudioPlayListWatcher = async(db, dbUrl, dbName, socket) => {
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

const dbWatcher = {
  async init(db, socket) {
    await initAppStateChangesWatcher(db, config.couchDbUrl, config.couchDbName, socket);
    await initModeChangesWatcher(db, config.couchDbUrl, config.couchDbName, socket);
    await initAudioPlayListWatcher(db, config.couchDbUrl, config.couchDbName, socket);
    await initAlarmChangesWatcher(config.couchDbUrl, config.couchDbName);
  }
}

module.exports = dbWatcher;
