import follow from 'follow';
import fs from 'fs';
import path from 'path';

import config from '../config';
import constants from '../constants';

/* eslint no-console: ["error", { allow: ["log"] }] */
export const sendLog = (func, message) => {
  if (config.debug) {
    console.log(func, message);
  }
};

export const dbDocumentWatcher = (dbUrl, dbName, documentId, changeCallback) => {
  const params = {
    db: `${dbUrl}/${dbName}`,
    since: 'now',
    include_docs: true,
    filter: (doc) => {
      return (doc._id === documentId);
    },
  };
  const feed = new follow.Feed(params);
  feed.follow();
  feed.on('change', (change) => {
    changeCallback(change);
  });
};

export const checkDbFieldChanges = (field, state, newState) => {
  const newValue = newState[field];
  if (newValue !== state[field]) {
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
    return {};
  }).filter(item => item !== {});
  if (diff.length === 0) {
    diff = ids1.map((id, index) => {
      if (ids2.indexOf(id) < 0) {
        return { action: 'delete', item: obj1[index] };
      }
      return {};
    }).filter(item => item !== {});
  }
  if (diff.length === 0) {
    diff = ids1.map((id, index) => {
      const item1 = obj1[index];
      const item2 = obj2[index];
      if (item1[valueField] !== item2[valueField]) {
        return { action: 'rescan', item: obj2[index] };
      }
      return {};
    })
      .filter(item => item !== {});
  }
  return diff;
};

async function getFmRadioFrequency(db, dbName, itemId) {
  try {
    const doc = await db.getDocument(dbName, constants.dbDocumentFmRadio);
    if (doc.data[constants.dbFieldState]) {
      const state = doc.data[constants.dbFieldState];
      const item = state.filter(subItem => subItem.id === itemId);
      if (item !== undefined) {
        return parseFloat(item[0].value) * 10;
      }
      return constants.minFmFrequency;
    }
  } catch (e) {
    return constants.minFmFrequency;
  }
}

export async function playSelectedItem(
  db,
  dbName,
  serialController,
  mediaController,
  socket,
  serialPort,
  mqttClient,
  mode,
  selectedId,
) {
  if (mode === constants.modeWebRadio) {
    sendLog('playSelectedItem()', `modeWebRadio ${selectedId}`);
    await serialController.sendWebRadioItem(serialPort, selectedId);
    await mediaController.playWebRadioItem(selectedId, socket, serialPort, mqttClient);
  } else if (mode === constants.modeFmRadio) {
    sendLog('playSelectedItem()', `modeFmRadio ${selectedId}`);
    await serialController.sendFmRadioItem(serialPort, selectedId);
    await serialController.sendFmRadioFrequency(
      serialPort,
      await getFmRadioFrequency(db, dbName, selectedId),
    );
  } else if (mode === constants.modeAudioPlayer) {
    sendLog('playSelectedItem()', `modeAudioPlayer ${selectedId[0]} ${selectedId[1]}`);
    await serialController.sendAudioPlayerItem(serialPort, selectedId[1]);
    await mediaController.playAudioPlaylistItem(selectedId[0], false);
    await mediaController.playAudioTrackItem(selectedId[1], socket, serialPort, mqttClient, true);
  }
}

export async function getState(db, dbName) {
  let state = {};

  try {
    const doc = await db.getDocument(dbName, constants.dbDocumentAppState);
    if (doc.data[constants.dbFieldState]) {
      state = doc.data[constants.dbFieldState];
    }
  } catch (e) {
    state[constants.dbStatusMode] = 'WebRadio';
    state[constants.dbStatusPower] = false;
    state[constants.dbStatusSleepTimerOn] = false;
    state[constants.dbStatusSelectedWebRadioId] = 1;
    state[constants.dbStatusSelectedAudioPlayListId] = 0;
    state[constants.dbStatusSelectedAudioTrackId] = 0;
  }
  return state;
}

export async function getMode(db, dbName) {
  const state = await getState(db, dbName);
  return state[constants.dbStatusMode];
}

async function setAppStateFields(db, params) {
  const appState = { madeBy: 'mediaController' };
  try {
    const doc = await db.getDocument(config.couchDbName, constants.dbDocumentAppState);
    if (doc.data[constants.dbFieldState]) {
      appState._rev = doc.data._rev;
      appState[constants.dbFieldState] = doc.data[constants.dbFieldState];
    }
    for (const key in params) {
      if ({}.hasOwnProperty.call(params, key)) {
        appState[constants.dbFieldState][key] = params[key];
      }
    }
    await db.createDocument(config.couchDbName, appState, constants.dbDocumentAppState);
  } catch (e) {
    sendLog('setAppStateFields()', e);
  }
}

export async function setAppStateField(db, field, value) {
  await setAppStateFields(db, { [field]: value });
}

export async function setVolumeMute(db, value) {
  await setAppStateField(db, constants.dbStatusVolumeMute, value);
}

export async function setVolume(db, value) {
  await setAppStateField(db, constants.dbStatusVolume, value);
}

export async function setWebRadioSelect(db, value) {
  await setAppStateField(db, constants.dbStatusSelectedWebRadioId, value);
}

export async function setFmRadioSelect(db, value) {
  await setAppStateField(db, constants.dbStatusSelectedFmRadioId, value);
}

export async function setPlayerTrack(db, value) {
  await setAppStateField(db, constants.dbStatusSelectedAudioTrackId, value);
}

export async function setSleepTimer(db, time, enabled) {
  const params = {
    [constants.dbStatusSleepTimer]: time,
    [constants.dbStatusSleepTimerOn]: enabled,
  };
  await setAppStateFields(db, params);
}

export async function setPower(db, value) {
  await setAppStateField(db, constants.dbStatusPower, value);
}

async function setAlarmEnabled(db, alarm, value) {
  try {
    const doc = await db.getDocument(config.couchDbName, constants.dbDocumentAlarm);
    if (doc.data[constants.dbFieldState]) {
      const state = doc.data[constants.dbFieldState];
      const newData = [];
      for (const item of state) {
        if (item.id === alarm) {
          item.enabled = value;
        }
        newData.push(item);
      }
      const newDoc = {
        madeBy: 'serialCommand',
        _rev: doc.data._rev,
        [constants.dbFieldState]: newData,
      };
      await db.createDocument(config.couchDbName, newDoc, constants.dbDocumentAlarm);
    }
  } catch (e) {
    sendLog('setAlarmEnabled()', e);
  }
}

export async function setAlarm1(db, value) {
  await setAlarmEnabled(db, 1, value);
}

export async function setAlarm2(db, value) {
  await setAlarmEnabled(db, 2, value);
}

export async function setMode(db, mode) {
  await setAppStateField(db, constants.dbStatusMode, mode);
}

export async function setAlarm(db, power, volume, mode, selectedId) {
  let selectionKey;
  if (mode === constants.modeWebRadio) {
    selectionKey = constants.dbStatusSelectedWebRadioId;
  } else if (mode === constants.modeFmRadio) {
    selectionKey = constants.dbStatusSelectedFmRadioId;
  }
  const params = {
    [constants.dbStatusPower]: power,
    [constants.dbStatusVolume]: volume,
    [selectionKey]: selectedId,
  };
  await setAppStateFields(db, params);
}

const getSubFolders = (rootDir, folder) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(rootDir, folder), (childError, files) => {
      if (childError) {
        return reject(childError);
      }
      Promise.all(files.map(child => path.join('', child), false))
        .then((children) => {
          children = children.filter(item => item.title !== '');
          const result = { madeBy: 'audioFolderWatcher', state: children };
          resolve(result);
        }).catch((error) => {
          reject(error);
        });
    });
  });
};

export async function scanFolder(db, dbName, folder) {
  let folders = [];
  try {
    folders = await getSubFolders(config.contentDir, folder);
    const doc = await db.getDocument(dbName, constants.dbDocumentAudioFolder);
    if (doc.data) {
      folders._rev = doc.data._rev;
    }
  } catch (e) {
    sendLog('queue', e);
  }
  await db.createDocument(dbName, folders, constants.dbDocumentAudioFolder);
}
