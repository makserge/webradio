import follow from 'follow';

import config from '../config';
import constants from '../constants';

export const dbDocumentWatcher = (dbUrl, dbName, documentId, changeCallback) => {
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

export const checkDbFieldChanges = (field, state, newState) => {
	const newValue = newState[field];
	if (newValue != state[field]) {
		state[field] = newValue;
		return newValue;
	}
  return null;
};

export const getObjectDiff = (obj1, obj2, titleField, valueField) => {
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
};

const getFmRadioFrequency = async(db, dbName, itemId) => {
  try {
		const doc = await db.getDocument(dbName, constants.dbDocumentFmRadio);
		if (doc.data[constants.dbFieldState]) {
			let state = doc.data[constants.dbFieldState];
      const item = state.filter(item => item.id === itemId);
      if (item != undefined) {
        return parseFloat(item[0].value) * 10;
      }
      return constants.minFmFrequency;
		}
	} catch(e) {
      return constants.minFmFrequency;
  }
}

export const playSelectedItem = async(db, dbName, serialController, mediaController,
  socket, serialPort, mode, selectedId) => {
  if (mode === constants.modeWebRadio) {
    console.log('modeWebRadio', selectedId);
    serialController.sendWebRadioItem(serialPort, selectedId);
    mediaController.playWebRadioItem(selectedId, socket, serialPort);
  }
  else if (mode === constants.modeFmRadio) {
    console.log('modeFmRadio', selectedId);
    serialController.sendFmRadioItem(serialPort, selectedId);
    serialController.sendFmRadioFrequency(serialPort, await getFmRadioFrequency(db, dbName, selectedId));
  }
  else if (mode === constants.modeAudioPlayer) {
    console.log('modeAudioPlayer', selectedId[0], selectedId[1]);
    serialController.sendAudioPlayerItem(serialPort, selectedId[1]);
    await mediaController.playAudioPlaylistItem(selectedId[0], false);
    mediaController.playAudioTrackItem(selectedId[1], socket, serialPort, true);
  }
}

export const getMode = async(db, dbName) => {
  let mode;
  try {
    const doc = await db.getDocument(dbName, constants.dbDocumentNavigation);
    if (doc.data[constants.dbFieldState]) {
      mode = doc.data[constants.dbFieldState][constants.dbFieldRoutes][0][constants.dbFieldIndex];
    }
  }
  catch(e) {
  }
  return mode;
}

export const getState = async(db, dbName) => {
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

export const setAppStateField = async(db, field, value) => {
  await setAppStateFields(db, { [field]: value });
}

const setAppStateFields = async(db, params) => {
  let appState = { madeBy: 'mediaController' };
  try {
    const doc = await db.getDocument(config.couchDbName, constants.dbDocumentAppState);
    if (doc.data[constants.dbFieldState]) {
      appState._rev = doc.data._rev;
      appState[constants.dbFieldState] = doc.data[constants.dbFieldState];
    }
    for (const key in params) {
      appState[constants.dbFieldState][key] = params[key];
    }
    await db.createDocument(config.couchDbName, appState, constants.dbDocumentAppState);
  }
  catch(e) {
    console.log(e);
  }
}

export const setVolumeMute = (db, value) => {
  setAppStateField(db, constants.dbStatusVolumeMute, value);
}

export const setVolume = (db, value) => {
  setAppStateField(db, constants.dbStatusVolume, value);
}

export const setWebRadioSelect = (db, value) => {
  setAppStateField(db, constants.dbStatusSelectedWebRadioId, value);
}

export const setFmRadioSelect = (db, value) => {
  setAppStateField(db, constants.dbStatusSelectedFmRadioId, value);
}

export const setPlayerTrack = (db, value) => {
  setAppStateField(db, constants.dbStatusSelectedAudioTrackId, value);
}

export const setSleepTimer = (db, time, enabled) => {
  const params = {
    [constants.dbStatusSleepTimer]: time,
    [constants.dbStatusSleepTimerOn]: enabled
  };
  setAppStateFields(db, params);
}

export const setAlarm1 = (db, value) => {
  setAlarmEnabled(db, 1, value);
}

export const setAlarm2 = (db, value) => {
  setAlarmEnabled(db, 2, value);
}

export const setPower = (db, value) => {
  setAppStateField(db, constants.dbStatusPower, value);
}

const setAlarmEnabled = async(db, alarm, value) => {
  try {
		const doc = await db.getDocument(config.couchDbName, constants.dbDocumentAlarm);
		if (doc.data[constants.dbFieldState]) {
			const state = doc.data[constants.dbFieldState];
      let newData = [];
      for (const item of state) {
        if (item.id === alarm) {
          item.enabled = value;
        }
        newData.push(item);
      }
      const newDoc = {
        madeBy: 'serialCommand',
        _rev: doc.data._rev,
        [constants.dbFieldState]: newData
      };
      await db.createDocument(config.couchDbName, newDoc, constants.dbDocumentAlarm);
		}
	}
	catch(e) {
    console.log(e);
  }
}

export const setMode = async(db, mode) => {
  let state = { madeBy: 'mediaController' };
  try {
    const doc = await db.getDocument(config.couchDbName, constants.dbDocumentNavigation);
    if (doc.data[constants.dbFieldState]) {
      state._rev = doc.data._rev;
      state[constants.dbFieldState] = doc.data[constants.dbFieldState];
    }
    state[constants.dbFieldState][constants.dbFieldRoutes][0][constants.dbFieldIndex] = mode;
    await db.createDocument(config.couchDbName, state, constants.dbDocumentNavigation);
  }
  catch(e) {
    console.log(e);
  }
}

export const setAlarm = async(db, power, volume, mode, selectedId) => {
  let selectionKey;
  if (mode === constants.modeWebRadio) {
    selectionKey = constants.dbStatusSelectedWebRadioId;
  }
  else if (mode === constants.modeFmRadio) {
    selectionKey = constants.dbStatusSelectedFmRadioId;
  }
  const params = {
    [constants.dbStatusPower]: power,
    [constants.dbStatusVolume]: volume,
    [selectionKey]: selectedId
  };
  setAppStateFields(db, params);
}
