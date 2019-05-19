import follow from 'cloudant-follow';
import path from 'path';
import execa from 'execa';
import ShairportReader from 'shairport-sync-reader';

import config from '../config';
import constants from '../constants';
// eslint-disable-next-line import/no-cycle
import {
  playAudioTrackItem,
  getAudioFolderList,
  playWebRadioItem,
  playDabRadioItem,
  loadAudioPlaylistItem,
  playAudioPlaylistItem,
} from '../controller/mediaController';

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

export const getObjectDiff = (obj1, obj2, valueField) => {
  let diff;

  const ids1 = obj1.map(item => item.id);
  const ids2 = obj2.map(item => item.id);

  diff = ids2.map((id, index) => {
    if (ids1.indexOf(id) < 0) {
      return { action: 'add', item: obj2[index] };
    }
    return null;
  }).filter(item => item !== null);
  if (diff.length === 0) {
    diff = ids1.map((id, index) => {
      if (ids2.indexOf(id) < 0) {
        return { action: 'delete', item: obj1[index] };
      }
      return null;
    }).filter(item => item !== null);
  }
  if (diff.length === 0) {
    diff = ids1.map((id, index) => {
      const item1 = obj1[index];
      const item2 = obj2[index];
      if (item1[valueField].length !== item2[valueField].length) {
        return { action: 'rescan', item: item2 };
      }
      return null;
    }).filter(item => item !== null);
  }
  return diff;
};

async function getFmRadioFrequency(db, itemId) {
  try {
    const doc = await db.get(constants.dbDocumentFmRadio);
    if (doc[constants.dbFieldState]) {
      const state = doc[constants.dbFieldState];
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

export async function getCount(db, document) {
  try {
    const doc = await db.get(document);
    if (doc[constants.dbFieldState]) {
      const state = doc[constants.dbFieldState];
      return state.length;
    }
  } catch (e) {
    sendLog('getCount()', e);
  }
}

let airplayMetadataReader;
const airPlayMeta = {
  state: 'play',
  title: '',
  artist: '',
  album: '',
  totalTime: '0:00',
  format: '',
  volume: 0,
  track: 0,
};

const pushAirplayMeta = (socket, mqttClient) => {
  sendLog('pushAirplayMeta()', airPlayMeta);
  socket.broadcast(constants.socketMediaMetaInfo, airPlayMeta);
  mqttClient.publish(constants.mqttPublishTrackStatusTopic, JSON.stringify(airPlayMeta));
};

export const formatTime = (time) => {
  const pad = input => input < 10 ? `0${input}` : input;
  const hour = Math.floor(time / 3600);
  const min = pad(Math.floor((time % 3600) / 60));
  const sec = pad(Math.floor(time % 60));
  if (hour) {
    return `${pad(hour)}:${min}:${sec}`;
  }
  return `${min}:${sec}`;
};

const startAirplayMetaDataListener = (socket, mqttClient) => {
  if (airplayMetadataReader) {
    return;
  }
  airplayMetadataReader = new ShairportReader({
    address: config.airplayMetadataReaderHost,
    port: config.airplayMetadataReaderPort,
  });

  airplayMetadataReader.on('pbeg', () => {
    airPlayMeta.state = 'play';
    airPlayMeta.title = '';
    airPlayMeta.artist = '';
    airPlayMeta.album = '';
    airPlayMeta.totalTime = '0:00';
    airPlayMeta.format = '';
    airPlayMeta.track = 0;

    pushAirplayMeta(socket, mqttClient);
  });

  airplayMetadataReader.on('meta', (meta) => {
    if (meta.asaa !== undefined && meta.asaa.length > 0) {
      airPlayMeta.artist = meta.asaa;
    }
    if (meta.minm !== undefined && meta.minm.length > 0) {
      airPlayMeta.title = meta.minm;
    }
    if (meta.asar !== undefined && meta.asar.length > 0) {
      airPlayMeta.artist = meta.asar;
    }
    if (meta.asal !== undefined && meta.asal.length > 0) {
      airPlayMeta.album = meta.asal;
    }
    if (meta.assr !== undefined && meta.assr.length > 0) {
      airPlayMeta.format = `${meta.assr}:16:2`;
    } else {
      airPlayMeta.format = '44100:16:2';
    }
    if (meta.caps !== undefined && meta.caps === 1) {
      airPlayMeta.state = 'play';
    }
    if (meta.caps !== undefined && meta.caps === 2) {
      airPlayMeta.state = 'pause';
    }
    if (meta.astc !== undefined) {
      airPlayMeta.track = meta.astc;
    }
    if (meta.astm !== undefined && meta.astm > 0) {
      airPlayMeta.totalTime = formatTime(meta.astm / 1000);
    }
    pushAirplayMeta(socket, mqttClient);
  });

  airplayMetadataReader.on('pvol', (volume) => {
    if (volume.airplay !== -144) {
      airPlayMeta.volume = volume;
    }

    pushAirplayMeta(socket, mqttClient);
  });

  airplayMetadataReader.on('pend', () => {
    airPlayMeta.state = 'stop';
    airPlayMeta.title = '';
    airPlayMeta.artist = '';
    airPlayMeta.album = '';
    airPlayMeta.totalTime = '0:00';
    airPlayMeta.format = '';
    airPlayMeta.track = 0;

    pushAirplayMeta(socket, mqttClient);
  });
};

export async function startAirPlay(isStart, socket, mqttClient) {
  sendLog('startAirPlay()', isStart);
  if (isStart) {
    await execa.shellSync(constants.airPlayStartCommand);
    startAirplayMetaDataListener(socket, mqttClient);
  } else {
    await execa.shellSync(constants.airPlayStopCommand);
  }
}

export async function playSelectedItem(
  db,
  serialController,
  socket,
  mqttClient,
  mode,
  selectedId,
) {
  if (mode === constants.modeWebRadio) {
    sendLog('playSelectedItem()', `modeWebRadio ${selectedId}`);
    await serialController.sendWebRadioItem(selectedId);
    await loadAudioPlaylistItem(constants.webRadioPlaylist);
    await playWebRadioItem(selectedId, socket, serialController, mqttClient);
  } else if (mode === constants.modeDabRadio) {
    sendLog('playSelectedItem()', `modeDabRadio ${selectedId}`);
    await serialController.sendDabRadioItem(selectedId);
    await playDabRadioItem(selectedId, serialController);
  } else if (mode === constants.modeFmRadio) {
    sendLog('playSelectedItem()', `modeFmRadio ${selectedId}`);
    await serialController.sendFmRadioItem(selectedId);
    await serialController.sendFmRadioFrequency(await getFmRadioFrequency(db, selectedId));
  } else if (mode === constants.modeAudioPlayer) {
    sendLog('playSelectedItem()', `modeAudioPlayer ${selectedId[0]} ${selectedId[1]}`);
    await loadAudioPlaylistItem(selectedId[0]);
    await serialController.sendAudioPlayerItem(selectedId[1]);
    await playAudioPlaylistItem(selectedId[0]);
    const trackCount = await getCount(db, constants.dbDocumentAudioTrack);
    if (trackCount > 0) {
      await playAudioTrackItem(selectedId[1], socket, serialController, mqttClient, true);
    }
  } else if (mode === constants.modeAirPlay) {
    await startAirPlay(true, socket, mqttClient);
  }
}

export async function getState(db) {
  let state = {};

  try {
    const doc = await db.get(constants.dbDocumentAppState);
    if (doc[constants.dbFieldState]) {
      state = doc[constants.dbFieldState];
    }
  } catch (e) {
    state[constants.dbStatusMode] = 'WebRadio';
    state[constants.dbStatusPower] = false;
    state[constants.dbStatusSleepTimerOn] = false;
    state[constants.dbStatusSelectedWebRadioId] = 1;
    state[constants.dbStatusSelectedDabRadioId] = 1;
    state[constants.dbStatusSelectedAudioPlayListId] = 0;
    state[constants.dbStatusSelectedAudioTrackId] = 0;
  }
  return state;
}

export async function getMode(db) {
  const state = await getState(db);
  return state[constants.dbStatusMode];
}

async function setAppStateFields(db, params) {
  const appState = { madeBy: 'mediaController' };
  try {
    const doc = await db.get(constants.dbDocumentAppState);
    if (doc[constants.dbFieldState]) {
      appState._rev = doc._rev;
      appState[constants.dbFieldState] = doc[constants.dbFieldState];
    }
    Object.keys(params).forEach((key) => {
      appState[constants.dbFieldState][key] = params[key];
    });
    await db.insert(appState, constants.dbDocumentAppState);
  } catch (e) {
    sendLog('setAppStateFields()', params, e);
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

export async function setDabRadioSelect(db, value) {
  await setAppStateField(db, constants.dbStatusSelectedDabRadioId, value);
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
    const doc = await db.get(constants.dbDocumentAlarm);
    if (doc[constants.dbFieldState]) {
      const state = doc[constants.dbFieldState];
      const newData = [];
      for (const item of state) {
        if (item.id === alarm) {
          item.enabled = value;
        }
        newData.push(item);
      }
      const newDoc = {
        madeBy: 'serialCommand',
        _rev: doc._rev,
        [constants.dbFieldState]: newData,
      };
      await db.insert(newDoc, constants.dbDocumentAlarm);
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

export async function scanFolder(db, folder) {
  sendLog('scanFolder()', folder);
  let folders = [];
  try {
    folders = await getAudioFolderList(config.contentDir, path.join(config.contentDir, folder));
    const doc = await db.get(constants.dbDocumentAudioFolder);
    if (doc) {
      folders._rev = doc._rev;
    }
  } catch (e) {
    sendLog('queue', e);
  }
  await db.insert(folders, constants.dbDocumentAudioFolder);
}

export async function updateAudioPlaylistProgressAndCount(db, id, count) {
  const state = { madeBy: 'mediaController' };
  try {
    const doc = await db.get(constants.dbDocumentAudioPlaylist);
    if (doc[constants.dbFieldState]) {
      state._rev = doc._rev;
      state[constants.dbFieldState] = doc[constants.dbFieldState];
    }
    state[constants.dbFieldState] = state[constants.dbFieldState].map((item) => {
      if (item.id === id) {
        item.isUpdating = false;
        item.tracksCount = count;
      }
      return item;
    });
    await db.insert(state, constants.dbDocumentAudioPlaylist);
  } catch (e) {
    sendLog('updateAudioPlaylistProgressAndCount()', e);
  }
}

export const sendRdsPs = (socket, mqttClient, data) => {
  socket.broadcast(constants.socketRdsPs, data);

  const json = { content: data };
  mqttClient.publish(constants.mqttPublishRdsPsTopic, JSON.stringify(json));
};

export const sendRdsRt = (socket, mqttClient, data) => {
  socket.broadcast(constants.socketRdsPs, data);

  const json = { content: data };
  mqttClient.publish(constants.mqttPublishRdsRtTopic, JSON.stringify(json));
};

export async function sendFmFreq(db, value) {
  await setAppStateField(db, constants.dbStatusSeekFmRadioFrequency, parseInt(value, 10) / 10);
  await setAppStateField(db, constants.dbStatusFmSeekUp, false);
  await setAppStateField(db, constants.dbStatusFmSeekDown, false);
}

export const sendFmStatus = (socket, stereo, level) => {
  const data = {
    stereo,
    level,
  };
  socket.broadcast(constants.socketRdsPs, data);
};

export const startScanDabPresets = (db) => {
  console.log('startScanDabPresets', constants.scanDabChannelsStartCommand);
  const command = constants.scanDabChannelsStartCommand;
  execa(command[0], command[1].split(' '))
    .then(async ({ stdout }) => {
      const result = JSON.parse(stdout);

      if (result.length > 1) {
        const state = [];
        let id = 0;
        for (const channel of result) {
          if (channel.channel) {
            for (const item of channel.programs) {
              if (item[0]) {
                id++;
                state.push({
                  id,
                  title: item[0],
                  channel: channel.channel,
                  program: item[0],
                });
              }
            }
          }
        }
        if (state.length) {
          try {
            const data = { madeBy: 'mediaController', [constants.dbFieldState]: state };
            const doc = await db.get(constants.dbDocumentDabRadio);
            if (doc) {
              data._rev = doc._rev;
            }
            await db.insert(data, constants.dbDocumentDabRadio);
          } catch (e) {
            sendLog('startScanDabPresets()', e);
          }
        }
      }
      await setAppStateField(db, constants.dbStatusRescanDabPresets, false);
    })
    .catch(error => console.log(error));
};

export const stopScanDabPresets = () => {
  const command = constants.scanDabChannelsStopCommand;
  execa(command[0], [command[1]]);
};
