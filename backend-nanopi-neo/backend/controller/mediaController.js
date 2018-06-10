import fs from 'fs';
import path from 'path';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';
import mpd from 'mpd';

import config from '../config';
import constants from '../constants';

import serialController from './serialController';
import { setAppStateField, sendLog } from '../watcher/utils';

const db = require('couchdb-promises')({
  baseUrl: config.couchDbUrl,
});

const mpdClient = mpd.connect({
  port: config.mpdPort,
  host: config.mpdHost,
});

const TIME_POLLING_INTERVAL = 1000; // 1 sec
const TITLE_POLLING_INTERVAL = 1000; // 1 sec

let timeTimer;
let titleTimer;

async function setCurrentTrack(trackId) {
  await setAppStateField(db, constants.dbStatusSelectedAudioTrackId, parseInt(trackId, 10));
};

const formatTime = (time) => {
  const pad = input => input < 10 ? `0${input}` : input;
  const hour = Math.floor(time / 3600);
  const min = pad(Math.floor((time % 3600) / 60));
  const sec = pad(Math.floor(time % 60));
  if (hour) {
    return `${pad(hour)}:${min}:${sec}`;
  }
  return `${min}:${sec}`;
};

const getMeta = () => {
  return new Promise((resolve, reject) => {
    mpdClient.sendCommand(constants.mpdCurrentSong, (err, msg) => {
      if (err) {
        sendLog('getMeta()', err);
        reject(err);
      }
      const data = { artist: '', title: '' };
      const meta = msg.split('\n');
      let matches;
      for (const item of meta) {
        matches = item.match(/file: ([^\n]+)/);
        if (matches) {
          data.file = matches[1].replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '');
        }
        matches = item.match(/Artist: ([^\n]+)/);
        if (matches) {
          [, data.artist] = matches;
        }
        matches = item.match(/Title: ([^\n]+)/);
        if (matches) {
          [, data.title] = matches;
        }
        matches = item.match(/Album: ([^\n]+)/);
        if (matches) {
          [, data.album] = matches;
        }
        matches = item.match(/Date: ([^\n]+)/);
        if (matches) {
          [, data.year] = matches;
        }
        matches = item.match(/Genre: ([^\n]+)/);
        if (matches) {
          [, data.genre] = matches;
        }
        matches = item.match(/Pos: ([^\n]+)/);
        if (matches) {
          [, data.pos] = matches;
        }
      }
      if (data.pos !== undefined) {
        resolve(data);
      } else {
        reject();
      }
    });
  });
};

const getStatus = () => {
  return new Promise((resolve, reject) => {
    mpdClient.sendCommand(constants.mpdStatus, (err, msg) => {
      if (err) {
        reject();
      }
      let elapsedTimeRaw = '0';
      let elapsedTime = '00:00';
      let totalTime = '00:00';
      let bitrate = '0';
      let format = '';
      let state = 'stop';
      const info = msg.split('\n').join('|');
      let matches = info.match(/time: ([^|]+)\|/);
      if (matches) {
        const time = matches[1];
        [elapsedTimeRaw, totalTime] = time.split(':');
        elapsedTime = formatTime(elapsedTimeRaw);
        totalTime = formatTime(totalTime);
      }

      matches = info.match(/bitrate: ([^|]+)\|/);
      if (matches) {
        [, bitrate] = matches;
      }

      matches = info.match(/audio: ([^|]+)\|/);
      if (matches) {
        [, format] = matches;
      }

      matches = info.match(/state: ([^|]+)\|/);
      if (matches) {
        [, state] = matches;
      }
      const data = {
        title: '',
        artist: '',
        elapsedTimeRaw,
        elapsedTime,
        totalTime,
        bitrate,
        format,
        state,
      };
      resolve(data);
    });
  });
};

const fixEncoding = (data) => {
  try {
    if (!data) {
      return data;
    }
    const encoding = jschardet.detect(data);
    if (encoding.encoding !== constants.mpdCharset) {
      data = iconv.decode(Buffer.from(data), encoding);
    }
  } catch (e) {
    sendLog('fixEncoding()', e);
  }
  return data;
};

const startMetaInfoUpdating = (socket, serialPort, mqttClient, isUpdateTrack) => {
  if (titleTimer) {
    clearInterval(titleTimer);
  }
  let meta;
  let oldPos = -1;
  titleTimer = setInterval(async function () {
    try {
      meta = await getMeta();
      meta.pos++;
      if (isUpdateTrack && meta.pos !== -1 && meta.pos !== oldPos) {
        oldPos = meta.pos;
        await setCurrentTrack(meta.pos);
      }
    } catch (e) {
      sendLog('startMetaInfoUpdating()', e);
    }
  }, TITLE_POLLING_INTERVAL);
  if (timeTimer) {
    clearInterval(timeTimer);
  }
  timeTimer = setInterval(async function () {
    const data = await getStatus();
    if (meta) {
      if (meta.artist) {
        data.artist = meta.artist;
        data.title = meta.title;
      } else if (meta.title) {
        [data.artist, data.title] = meta.title.split(' - ');
      } else {
        [data.artist, data.title] = meta.file.split(' - ');
      }
      data.artist = fixEncoding(data.artist);
      data.title = fixEncoding(data.title);
    }
    if (data.state) {
      socket.broadcast(constants.socketMediaMetaInfo, data);
      mqttClient.publish(constants.mqttPublishTrackStatusTopic, JSON.stringify(data));
    }

    serialController.sendAudioPlayerElapsedTime(serialPort, data.elapsedTimeRaw);
  }, TIME_POLLING_INTERVAL);
};

const stopMetaInfoUpdating = () => {
  if (titleTimer) {
    clearInterval(titleTimer);
  }
  if (timeTimer) {
    clearInterval(timeTimer);
  }
};

const walkContentFoldersTree = (dir) => {
  const walk = (entry) => {
    return new Promise((resolve) => {
      fs.exists(entry, (exists) => {
        if (!exists) {
          return resolve({});
        }
        return resolve(new Promise((resolve1, reject1) => {
          fs.lstat(entry, (err, stats) => {
            if (err) {
              return reject1(err);
            }
            if (!stats.isDirectory()) {
              const match = path.basename(entry).match(/\.(jpg|png|gif)\b/);
              if (match != null) {
                return resolve1({
                  title: '',
                });
              }
              return resolve1(entry);
            }
            resolve(new Promise((resolve2, reject2) => {
              fs.readdir(entry, (error, files) => {
                if (error) {
                  return reject2(err);
                }
                Promise.all(files.map(child => walk(path.join(entry, child))))
                  .then((children) => {
                    children = children.filter(item => item.title !== '');
                    resolve2(children);
                  })
                  .catch((error1) => {
                    reject2(error1);
                  });
              });
            }));
          });
        }));
      });
    });
  };
  return walk(dir);
};

async function playWebRadioItem(itemId, socket, serialPort, mqttClient) {
  try {
    const doc = await db.getDocument(config.couchDbName, constants.dbDocumentWebRadio);
    if (!doc.data[constants.dbFieldState]) {
      return;
    }
    const item = doc.data[constants.dbFieldState].filter((subItem) => {
      return subItem[constants.dbId] === itemId;
    });
    if (!item[0]) {
      return;
    }
    const url = item[0][constants.dbWebRadioUrl];
    sendLog('playWebRadioItem()', url);
    if (!url) {
      return;
    }
    const commandList = [
      constants.mpdClear,
      `${constants.mpdAdd} ${url}`,
      constants.mpdPlay,
    ];
    mpdClient.sendCommands(commandList, () => {
      startMetaInfoUpdating(socket, serialPort, mqttClient, false);
    });
  } catch (e) {
    sendLog('playWebRadioItem()', e);
  }
};

async function loadAudioPlaylistItem(itemId) {
  const commandList = [
    constants.mpdClear,
    `${constants.mpdLoad} "${itemId}"`,
  ];
  return new Promise((resolve, reject) => {
    mpdClient.sendCommands(commandList, (err) => {
      if (err) {
        sendLog('loadAudioPlaylistItem()', err);
        reject();
      }
      resolve();
    });
  });
};

/*
const shuffle = (array) => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};
*/

const playAudioPlaylistItem = (itemId) => {
  return new Promise((resolve, reject) => {
    mpdClient.sendCommand(`${constants.mpdListPlaylistInfo} "${itemId}"`, async function (err, msg) {
      if (err) {
        sendLog('playAudioPlaylistItem()', err);
        return;
      }
      const files = msg.split('\n');
      let id = 0;
      let item;
      let matches;
      const items = [];
      for (const meta of files) {
        matches = meta.match(/file: ([^\n]+)/);
        if (matches) {
          id++;
          item = { file: matches[1], id };
        }
        matches = meta.match(/Artist: ([^\n]+)/);
        if (matches) {
          [, item.artist] = matches;
        }
        matches = meta.match(/Title: ([^\n]+)/);
        if (matches) {
          [, item.title] = matches;
        }
        matches = meta.match(/Album: ([^\n]+)/);
        if (matches) {
          [, item.album] = matches;
        }
        matches = meta.match(/Date: ([^\n]+)/);
        if (matches) {
          [, item.year] = matches;
        }
        matches = meta.match(/Genre: ([^\n]+)/);
        if (matches) {
          [, item.genre] = matches;
        }
        matches = meta.match(/Time: ([^\n]+)/);
        if (matches) {
          [, item.duration] = matches;
          if (!item.artist) {
            const file = item.file.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '');
            [item.artist, item.title] = file.split(' - ');
          }
          item.artist = fixEncoding(item.artist);
          item.title = fixEncoding(item.title);

          items.push(item);
        }
      }
      const data = {
        madeBy: 'mediaController',
        state: items,
      };
      try {
        const doc = await db.getDocument(config.couchDbName, constants.dbDocumentAudioTrack);
        if (doc.data) {
          data._rev = doc.data._rev;
        }
      } catch (e) {
        sendLog('playAudioPlaylistItem()', e);
        reject(e);
      }
      await db.createDocument(config.couchDbName, data, constants.dbDocumentAudioTrack);
      resolve();
    });
  });
};

async function playAudioTrackItem(itemId, socket, serialPort, mqttClient) {
  try {
    const doc = await db.getDocument(config.couchDbName, constants.dbDocumentAudioTrack);
    const state = doc.data[constants.dbFieldState];
    if (itemId > state.length) {
      return;
    }
  } catch (e) {
    sendLog('playAudioTrackItem()', e);
  }
  itemId--;
  mpdClient.sendCommand(`${constants.mpdPlay} ${itemId}`, (err) => {
    if (err) {
      sendLog('playAudioTrackItem()', err);
      return err;
    }
    startMetaInfoUpdating(socket, serialPort, mqttClient, true);
  });
};

const addPlaylist = (itemId) => {
  return new Promise((resolve, reject) => {
    mpdClient.sendCommand(`${constants.mpdPlaylistSave} "${itemId}"`, (err) => {
      if (err) {
        sendLog('addPlaylist()', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const deletePlaylist = (itemId) => {
  mpdClient.sendCommand(`${constants.mpdPlaylistRm} "${itemId}"`, (err) => {
    if (err) {
      sendLog('deletePlaylist()', err);
      return err;
    }
  });
};

const addPlaylistItems = (itemId, items) => {
  const commandList = [];
  const walkTree = (subItemId, subItems) => {
    for (let item of subItems) {
      if (Array.isArray(item)) {
        walkTree(subItemId, item);
      } else {
        item = item.replace(`${config.contentDirMpd}/`, '');
        commandList.push(`${constants.mpdPlaylistAdd} "${itemId}" "${item}"`);
      }
    }
  };
  walkTree(itemId, items);

  const keys = Array.from({ length: commandList.length }, (value, key) => key);
  // Disable shuffle on playlist load
  // keys = shuffle(keys);

  for (const item of keys) {
    mpdClient.sendCommand(commandList[item], (err) => {
      if (err) {
        sendLog('addPlaylistItems()', `${commandList[item]} ${err}`);
      }
    });
  }
};

const rescanPlaylist = (itemId, playlistPath) => {
  return new Promise(async function (resolve, reject) {
    try {
      sendLog('rescanPlaylist()', `${config.contentDir}${playlistPath}`);
      const files = await walkContentFoldersTree(`${config.contentDir}${playlistPath}`);

      mpdClient.sendCommand(`${constants.mpdPlaylistClear} "${itemId}"`, (err) => {
        if (err) {
          sendLog('rescanPlaylist()', err);
          reject(err);
        }
        if (!files) {
          reject();
        }
        addPlaylistItems(itemId, files);
        resolve();
      });
    } catch (e) {
      sendLog('rescanPlaylist()', e);
    }
  });
};

const mediaController = {
  async playWebRadioItem(itemId, socket, serialPort, mqttClient) {
    sendLog('playWebRadioItem()', itemId);
    playWebRadioItem(itemId, socket, serialPort, mqttClient);
  },

  async playAudioPlaylistItem(itemId, isSetCurrentPlaylist) {
    sendLog('playAudioPlaylistItem()', itemId);
    if (isSetCurrentPlaylist) {
      await setAppStateField(db, constants.dbStatusSelectedAudioPlayListId, parseInt(itemId, 10));
    }
    await loadAudioPlaylistItem(itemId);
    await playAudioPlaylistItem(itemId);
  },

  async playAudioTrackItem(itemId, socket, serialPort, mqttClient, isSetCurrentTrack) {
    sendLog('playAudioTrackItem()', itemId);
    if (isSetCurrentTrack) {
      await setCurrentTrack(itemId);
    }
    playAudioTrackItem(itemId, socket, serialPort, mqttClient);
  },

  stop(socket) {
    mpdClient.sendCommand(constants.mpdStop, () => {
      stopMetaInfoUpdating();
      socket.broadcast(constants.socketMediaMetaInfo, { state: 'stop' });
    });
  },

  async addPlaylist(itemId) {
    sendLog('addPlaylist()', itemId);
    await addPlaylist(itemId);
  },

  async deletePlaylist(itemId) {
    sendLog('deletePlaylist()', itemId);
    deletePlaylist(itemId);
  },

  async rescanPlaylist(itemId, filePath) {
    sendLog('rescanPlaylist()', itemId, path);
    await rescanPlaylist(itemId, filePath);
  },
};

export default mediaController;
