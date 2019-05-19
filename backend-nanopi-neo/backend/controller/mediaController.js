import dbClient from 'nano';
import fs from 'fs';
import path from 'path';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';
import mpd from 'mpd';
import execa from 'execa';

import config from '../config';
import constants from '../constants';

// eslint-disable-next-line import/no-cycle
import {
  setAppStateField,
  sendLog,
  formatTime,
} from '../watcher/utils';

const nano = dbClient(config.couchDbUrl);
const db = nano.use(config.couchDbName);

const mpdClient = mpd.connect({
  port: config.mpdPort,
  host: config.mpdHost,
});

const TIME_POLLING_INTERVAL = 1000; // 1 sec
const TITLE_POLLING_INTERVAL = 1000; // 1 sec

let timeTimer;
let titleTimer;

const mapDabChannel = {
  '5A': 1,
  '5B': 2,
  '5C': 3,
  '5D': 4,
  '6A': 5,
  '6B': 6,
  '6C': 7,
  '6D': 8,
  '7A': 9,
  '7B': 10,
  '7C': 11,
  '7D': 12,
  '8A': 13,
  '8B': 14,
  '8C': 15,
  '8D': 16,
  '9A': 17,
  '9B': 18,
  '9C': 19,
  '9D': 20,
  '10A': 21,
  '10B': 22,
  '10C': 23,
  '10D': 24,
  '10N': 25,
  '11A': 26,
  '11B': 27,
  '11C': 28,
  '11D': 29,
  '11N': 30,
  '12A': 31,
  '12B': 32,
  '12C': 33,
  '12D': 34,
  '12N': 35,
  '13A': 36,
  '13B': 37,
  '13C': 38,
  '13D': 39,
  '13E': 40,
  '13F': 41,
};

async function setCurrentTrack(trackId) {
  await setAppStateField(db, constants.dbStatusSelectedAudioTrackId, parseInt(trackId, 10));
}

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
      let random = '1';
      let track = '0';
      let totalTracks = '0';

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

      matches = info.match(/random: ([^|]+)\|/);
      if (matches) {
        [, random] = matches;
      }

      matches = info.match(/song: ([^|]+)\|/);
      if (matches) {
        [, track] = matches;
        const trackInt = parseInt(track, 10) + 1;
        track = trackInt.toString();
      }

      matches = info.match(/playlistlength: ([^|]+)\|/);
      if (matches) {
        [, totalTracks] = matches;
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
        random,
        track,
        totalTracks,
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

const startMetaInfoUpdating = (socket, serialController, mqttClient, isUpdateTrack) => {
  if (titleTimer) {
    clearInterval(titleTimer);
  }
  let meta;
  let oldPos = -1;
  titleTimer = setInterval(async () => {
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
  timeTimer = setInterval(async () => {
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
      data.isAudioPlayer = isUpdateTrack ? '1' : '0';
    }
    if (data.state) {
      socket.broadcast(constants.socketMediaMetaInfo, data);
      mqttClient.publish(constants.mqttPublishTrackStatusTopic, JSON.stringify(data));
    }

    serialController.sendAudioPlayerElapsedTime(data.elapsedTimeRaw);
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
              const match = path.basename(entry).match(/\.(JPG|jpg|PNG|png|GIF|gif|x32|log|exe|rar)\b/);
              if (match != null) {
                return resolve1(null);
              }
              return resolve1(entry);
            }
            resolve1(new Promise((resolve2, reject2) => {
              fs.readdir(entry, (error, files) => {
                if (error) {
                  return reject2(err);
                }
                Promise.all(files.map(child => walk(path.join(entry, child))))
                  .then((children) => {
                    children = children.filter(item => item !== null);
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

export async function playWebRadioItem(itemId, socket, serialController, mqttClient) {
  sendLog('playWebRadioItem()', itemId);
  try {
    const doc = await db.get(constants.dbDocumentWebRadio);
    if (!doc[constants.dbFieldState]) {
      return;
    }
    const item = doc[constants.dbFieldState].filter((subItem) => {
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
    itemId--;
    mpdClient.sendCommand(`${constants.mpdPlay} ${itemId}`, () => {
      startMetaInfoUpdating(socket, serialController, mqttClient, false);
    });
  } catch (e) {
    sendLog('playWebRadioItem()', e);
  }
}

export async function playDabRadioItem(itemId, serialController) {
  sendLog('playDabRadioItem()', itemId);
  try {
    const doc = await db.get(constants.dbDocumentDabRadio);
    if (!doc[constants.dbFieldState]) {
      return;
    }
    const item = doc[constants.dbFieldState].filter((subItem) => {
      return subItem[constants.dbId] === itemId;
    });
    if (!item[0]) {
      return;
    }
    const { channel, program } = item[0];
    serialController.sendDabChannel(mapDabChannel[channel]);

    sendLog('playDabRadioItem()', `channel: ${channel}, program: "${program}"`);
    execa(constants.dabRadioStartCommand, ['-C', channel, '-P', program])
      .catch(() => {});
  } catch (e) {
    sendLog('playWebRadioItem()', e);
  }
}

export const stopDabRadio = async () => {
  sendLog('stopDabRadio()', '');
  try {
    await execa.shellSync(constants.dabRadioStopCommand);
  // eslint-disable-next-line no-empty
  } catch (error) {}
};

export const addPlaylist = (itemId) => {
  sendLog('addPlaylist()', itemId);
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

export async function loadAudioPlaylistItem(itemId) {
  sendLog('loadAudioPlaylistItem()', '');
  return new Promise((resolve, reject) => {
    const commands = [
      constants.mpdClear,
      `${constants.mpdLoad} "${itemId}"`,
    ];
    mpdClient.sendCommands(commands, async (err) => {
      if (err) {
        await addPlaylist(itemId);
        sendLog('loadAudioPlaylistItem()', err);
        reject();
      }
      resolve();
    });
  });
}

export const playAudioPlaylistItem = (itemId) => {
  sendLog('playAudioPlaylistItem()', itemId);
  return new Promise((resolve, reject) => {
    mpdClient.sendCommand(`${constants.mpdListPlaylistInfo} "${itemId}"`, async (err, msg) => {
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
        const doc = await db.get(constants.dbDocumentAudioTrack);
        if (doc) {
          data._rev = doc._rev;
        }
      } catch (e) {
        sendLog('playAudioPlaylistItem()', e);
        reject(e);
      }
      await db.insert(data, constants.dbDocumentAudioTrack);
      resolve();
    });
  });
};

export async function playAudioTrackItem(itemId, socket, serialController, mqttClient,
  isSetCurrentTrack) {
  sendLog('playAudioTrackItem()', itemId);
  if (isSetCurrentTrack) {
    await setCurrentTrack(itemId);
  }
  try {
    const doc = await db.get(constants.dbDocumentAudioTrack);
    const state = doc[constants.dbFieldState];
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
    startMetaInfoUpdating(socket, serialController, mqttClient, true);
  });
}

export const deletePlaylist = (itemId) => {
  sendLog('deletePlaylist()', itemId);
  return new Promise((resolve, reject) => {
    mpdClient.sendCommand(`${constants.mpdPlaylistRm} "${itemId}"`, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

async function addPlaylistItem(item) {
  return new Promise((resolve, reject) => {
    mpdClient.sendCommand(item, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

/* eslint-disable no-await-in-loop */
async function addPlaylistItems(itemId, items) {
  let count = 0;
  async function walkTree(subItemId, subItems) {
    for (let item of subItems) {
      if (Array.isArray(item)) {
        await walkTree(subItemId, item);
      } else {
        item = item.replace(`${config.contentDirMpd}/`, '');
        const command = `${constants.mpdPlaylistAdd} "${itemId}" "${item}"`;
        try {
          await addPlaylistItem(command);
          count++;
        } catch (err) {
          sendLog('addPlaylistItems()', `${command} ${err}`);
        }
      }
    }
  }
  await walkTree(itemId, items);
  return count;
}

export const rescanPlaylist = (itemId, folders) => {
  sendLog('rescanPlaylist()', itemId, folders);
  return new Promise(async (resolve, reject) => {
    try {
      let files = [];
      for (const item of folders) {
        sendLog('rescanPlaylist()', `/${config.contentDir}/${item}`);
        files = [
          ...files,
          await walkContentFoldersTree(`/${config.contentDir}/${item}`),
        ];
      }
      mpdClient.sendCommand(`${constants.mpdPlaylistClear} "${itemId}"`, async (err) => {
        if (err) {
          sendLog('rescanPlaylist()', err);
          reject(err);
        }
        if (!files) {
          reject();
        }
        const count = await addPlaylistItems(itemId, files);
        resolve(count);
      });
    } catch (e) {
      sendLog('rescanPlaylist()', e);
    }
  });
};

export const clearPlaylist = (itemId) => {
  sendLog('clearPlaylist()', itemId);
  return new Promise(async (resolve, reject) => {
    try {
      mpdClient.sendCommand(`${constants.mpdPlaylistClear} "${itemId}"`, async (err) => {
        if (err) {
          sendLog('clearPlaylist()', err);
          reject(err);
        }
        resolve();
      });
    } catch (e) {
      sendLog('clearPlaylist()', e);
    }
  });
};

export const getAudioFolderList = (rootDir, currentDir) => {
  return new Promise((resolve, reject) => {
    mpdClient.sendCommand(`${constants.mpdListFolder} "${currentDir}"`, async (err, msg) => {
      if (err) {
        sendLog('getAudioFolderList()', err);
        reject();
        return;
      }
      const meta = msg.split('\n');
      let matches;
      let directory;
      let children = [];
      let index = 1;
      for (const item of meta) {
        matches = item.match(/directory: ([^\n]+)/);
        if (matches) {
          [, directory] = matches;
          const title = directory.replace(`${currentDir}/`, '');
          if (!title.startsWith('.')) {
            children = [
              ...children,
              {
                id: index++,
                title,
                path: directory.replace(`${rootDir}/`, ''),
              },
            ];
          }
        }
      }
      let parentDir = currentDir === rootDir ? '' : currentDir.replace(`${rootDir}/`, '');
      if (parentDir !== '') {
        parentDir = path.dirname(parentDir) === '.' ? '' : path.dirname(parentDir);
        children = [
          {
            id: 0,
            title: '..',
            path: parentDir,
          },
          ...children,
        ];
      }
      const result = { madeBy: 'audioFolderWatcher', state: children };
      resolve(result);
    });
  });
};

export const rescanAudioFolders = () => {
  sendLog('rescanAudioFolders()', '');
  return new Promise((resolve, reject) => {
    mpdClient.sendCommand(constants.mpdRescanAudioFolders, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

export async function updateWebRadioPlaylist(items) {
  try {
    await clearPlaylist(constants.webRadioPlaylist);
  } catch (e) {
    await addPlaylist(constants.webRadioPlaylist);
  }
  const commandList = [];
  for (const item of items) {
    commandList.push(`${constants.mpdPlaylistAdd} "${constants.webRadioPlaylist}" "${item.value}"`);
  }
  return new Promise((resolve) => {
    mpdClient.sendCommands(commandList, (err) => {
      if (err) {
        sendLog('updateWebRadioPlaylist()', err);
      }
      resolve();
    });
  });
}

export const setAudioPlayerShuttle = (state) => {
  return new Promise((resolve) => {
    mpdClient.sendCommand(`${constants.mpdRandom} ${state ? '1' : '0'}`, (err) => {
      if (err) {
        sendLog('setAudioPlayerShuttle()', err);
      }
      resolve();
    });
  });
};

export const setAudioPlayerPlay = (state) => {
  sendLog('setAudioPlayerPlay()', '');
  return new Promise((resolve) => {
    mpdClient.sendCommand(state ? constants.mpdPlay : constants.mpdPause, (err) => {
      if (err) {
        sendLog('setAudioPlayerPlay()', err);
      }
      resolve();
    });
  });
};

export const stop = (socket) => {
  sendLog('stop()', '');
  stopMetaInfoUpdating();
  socket.broadcast(constants.socketMediaMetaInfo, { state: 'stop' });
  return new Promise((resolve) => {
    mpdClient.sendCommand(constants.mpdStop, () => {
      resolve();
    });
  });
};
