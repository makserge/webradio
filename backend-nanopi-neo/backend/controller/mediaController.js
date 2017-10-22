'use strict';

import fs from 'fs';
import path from 'path';
import jschardet from "jschardet";
import iconv from 'iconv-lite';

import config from '../config';
import constants from '../constants';

import serialController from './serialController';
import { setAppStateField } from '../watcher/utils';

const db = require('couchdb-promises')({
	baseUrl: config.couchDbUrl,
});

import mpd from 'mpd';

const mpdClient = mpd.connect({
	port: config.mpdPort,
	host: config.mpdHost
});

const TIME_POLLING_INTERVAL = 1000; // 1 sec
const TITLE_POLLING_INTERVAL = 1000; // 1 sec

let timeTimer;
let titleTimer;

const setCurrentTrack = (trackId) => {
	setAppStateField(db, constants.dbStatusSelectedAudioTrackId, parseInt(trackId, 10));
}

const formatTime = (time) => {
	const pad = (input) => input < 10 ? '0' + input : input;
	const hour = Math.floor(time / 3600);
	const min = pad(Math.floor(time % 3600 / 60));
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
				console.log(err);
				reject(err);
			}
			let data = { artist: '', title: '' };
			const meta = msg.split('\n');
			let matches;
			for (let item of meta) {
				matches = item.match(/file: ([^\n]+)/);
				if (matches) {
					data.file = matches[1].replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, '');
				}
				matches = item.match(/Artist: ([^\n]+)/);
				if (matches) {
					data.artist = matches[1];
				}
				matches = item.match(/Title: ([^\n]+)/);
				if (matches) {
					data.title = matches[1];
				}
				matches = item.match(/Album: ([^\n]+)/);
				if (matches) {
					data.album = matches[1];
				}
				matches = item.match(/Date: ([^\n]+)/);
				if (matches) {
					data.year = matches[1];
				}
				matches = item.match(/Genre: ([^\n]+)/);
				if (matches) {
					data.genre = matches[1];
				}
				matches = item.match(/Pos: ([^\n]+)/);
				if (matches) {
					data.pos = matches[1];
				}
			}
			if (data.pos !== undefined) {
				resolve(data);
			}
			else {
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
			let matches = info.match(/time: ([^\|]+)\|/);
			if (matches) {
				const time = matches[1];
				const timeArray = time.split(':');
				elapsedTimeRaw = timeArray[0];
				elapsedTime = formatTime(timeArray[0]);
				totalTime = formatTime(timeArray[1]);
			}

			matches = info.match(/bitrate: ([^\|]+)\|/);
			if (matches) {
				bitrate = matches[1];
			}

			matches = info.match(/audio: ([^\|]+)\|/);
			if (matches) {
				format = matches[1];
			}

			matches = info.match(/state: ([^\|]+)\|/);
			if (matches) {
				state = matches[1];
			}

			const data = {
				title: '',
				artist: '',
				elapsedTimeRaw,
				elapsedTime,
				totalTime,
				bitrate,
				format,
				state
			};
			resolve(data);
		});
	});
};

const startMetaInfoUpdating = (socket, serialPort) => {
	if (titleTimer) {
		clearInterval(titleTimer);
	}
	let meta;
	let oldPos = -1;
	titleTimer = setInterval(async() => {
		try {
			meta = await getMeta();
			meta.pos++;
			if (meta.pos != -1 && meta.pos != oldPos) {
				oldPos = meta.pos;
				await setCurrentTrack(meta.pos);
			}
		}
		catch(e) {
		}
	}, TITLE_POLLING_INTERVAL);
	if (timeTimer) {
		clearInterval(timeTimer);
	}
	timeTimer = setInterval(async() => {
		const data = await getStatus();
		if (meta) {
			if (meta.artist) {
				data.artist = meta.artist;
				data.title = meta.title;
			}
			else if (meta.title) {
				const title = meta.title.split(' - ');
				data.artist = title[0];
				data.title = title[1];
			}
			else {
				const title = meta.file.split(' - ');
				data.artist = title[0];
				data.title = title[1];
			}
			data.artist = fixEncoding(data.artist);
			data.title = fixEncoding(data.title);
		}
		if (data.state) {
			socket.broadcast(constants.socketMediaMetaInfo, data);
		}

		serialController.sendAudioPlayerElapsedTime(serialPort, data.elapsedTimeRaw);

	}, TIME_POLLING_INTERVAL);
};

const sendMetaInfo = (socket, serialPort) => {
	if (socket.connections.size) {
		startMetaInfoUpdating(socket, serialPort);
	}

	socket.on('connection', async (ctx) => {
		console.log('Connect socket', ctx.socket.id);
		startMetaInfoUpdating(socket, serialPort);
	});

	socket.on('disconnect', ctx => {
		console.log( 'Disconnect socket', ctx.socket.id);
		if (!socket.connections.size) {
			stopMetaInfoUpdating();
		}
	});
};

const stopMetaInfoUpdating = () => {
	if (titleTimer) {
		clearInterval(titleTimer);
	}
	if (timeTimer) {
		clearInterval(timeTimer);
	}
}

const walkContentFoldersTree = (dir) => {
  const walk = (entry) => {
    return new Promise((resolve, reject) => {
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
						const match = path.basename(entry).match(/\.(jpg|png|gif)\b/);
						if (match != null) {
							return resolve({
								title: '',
							});
						}
						return resolve(entry);
					}
					resolve(new Promise((resolve, reject) => {
						fs.readdir(entry, (err, files) => {
							if (err) {
								return reject(err);
							}
							Promise.all(files.map(child => walk(path.join(entry, child)))).then(children => {
								children = children.filter(item => item.title !== '');
								resolve(children);
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
  return walk(dir);
};

const playWebRadioItem = async(itemId, socket, serialPort) => {
	try {
		const doc = await db.getDocument(config.couchDbName, constants.dbDocumentWebRadio);
		if (!doc.data[constants.dbFieldState]) {
			return;
		}
		const item = doc.data[constants.dbFieldState].filter((item) => {
			return item[constants.dbId] == itemId;
		});
		if (!item[0]) {
			return;
		}
		const url = item[0][constants.dbWebRadioUrl];
		console.log(url);
		if (!url) {
			return;
		}
		const commandList = [
			constants.mpdClear,
			`${constants.mpdAdd} ${url}`,
			constants.mpdPlay,
		];
		mpdClient.sendCommands(commandList, () => {
			sendMetaInfo(socket, serialPort);
		});
	}
	catch(e) {
		console.log(e);
	}
}

const loadAudioPlaylistItem = async(itemId) => {
	const commandList = [
		constants.mpdClear,
		`${constants.mpdLoad} "${itemId}"`,
	];
	return new Promise((resolve, reject) => {
		mpdClient.sendCommands(commandList, (err, msg) => {
			if (err) {
				console.log('loadAudioPlaylistItem', err);
				reject();
			}
			resolve();
		});
	});
}

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
}


const playAudioPlaylistItem = (itemId) => {
	return new Promise((resolve, reject) => {
		mpdClient.sendCommand(`${constants.mpdListPlaylistInfo} "${itemId}"`, async(err, msg) => {
			if (err) {
				console.log('playAudioPlaylistItem', err);
				return;
			}
			const files = msg.split('\n');
			let id = 0;
			let item;
			let matches;
			const items = [];
			for (let meta of files) {
				matches = meta.match(/file: ([^\n]+)/);
				if (matches) {
					id++;
					item = { file: matches[1], id: id };
				}
				matches = meta.match(/Artist: ([^\n]+)/);
				if (matches) {
					item.artist = matches[1];
				}
				matches = meta.match(/Title: ([^\n]+)/);
				if (matches) {
					item.title = matches[1];
				}
				matches = meta.match(/Album: ([^\n]+)/);
				if (matches) {
					item.album = matches[1];
				}
				matches = meta.match(/Date: ([^\n]+)/);
				if (matches) {
					item.year = matches[1];
				}
				matches = meta.match(/Genre: ([^\n]+)/);
				if (matches) {
					item.genre = matches[1];
				}
				matches = meta.match(/Time: ([^\n]+)/);
				if (matches) {
					item.duration = matches[1];
			  	if (!item.artist) {
			    	const file = item.file.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, '');
			    	[item.artist, item.title] = file.split(' - ');
			  	}
					item.artist = fixEncoding(item.artist);
					item.title = fixEncoding(item.title);

					items.push(item);
				}
			}
			const data = {
				madeBy: 'mediaController',
				state: items
			}
			try {
				const doc = await db.getDocument(config.couchDbName, constants.dbDocumentAudioTrack);
				if (doc.data) {
					data._rev = doc.data._rev;
				}
			}
			catch(e) {
				console.log(e);
				reject(e);
			}
			await db.createDocument(config.couchDbName, data, constants.dbDocumentAudioTrack);
		});
		resolve();
	});
}

const playAudioTrackItem = async(itemId, socket, serialPort) => {
	try {
		const doc = await db.getDocument(config.couchDbName, constants.dbDocumentAudioTrack);
		const state = doc.data[constants.dbFieldState];
		if (itemId > state.length) {
			return;
		}
	}
	catch(e) {
		console.log(e);
	}
	itemId--;
	mpdClient.sendCommand(`${constants.mpdPlay} ${itemId}`, (err, msg) => {
		if (err) {
			console.log('playAudioTrackItem', err);
			return err;
		}
		sendMetaInfo(socket, serialPort);
	});
}

const addPlaylist = (itemId) => {
	return new Promise((resolve, reject) => {
		mpdClient.sendCommand(`${constants.mpdPlaylistSave} "${itemId}"`, (err, msg) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

const deletePlaylist = (itemId) => {
	mpdClient.sendCommand(`${constants.mpdPlaylistRm} "${itemId}"`, (err, msg) => {
		if (err) {
			console.log(err);
			return err;
		}
	});
}

const addPlaylistItems = (itemId, items) => {
	const walkTree = (itemId, items) => {
		for (let item of items) {
			if (Array.isArray(item)) {
				walkTree(itemId, item);
			}
			else {
				item = item.replace(`${config.contentDirMpd}/`, '');
				commandList.push(`${constants.mpdPlaylistAdd} "${itemId}" "${item}"`);
			}
		}
	}
	const commandList = [];
	walkTree(itemId, items);

	let keys = Array.from({length: commandList.length}, (value, key) => key);
	//Disable shuffle on playlist load
	//keys = shuffle(keys);

	for (let item of keys) {
		mpdClient.sendCommand(commandList[item], (err, msg) => {
			if (err) {
				console.log(commandList[item]);
			}
		});
	}
}

const rescanPlaylist = (itemId, path) => {
	return new Promise(async(resolve, reject) => {
		try {
			console.log(`${config.contentDir}${path}`);
			const files = await walkContentFoldersTree(`${config.contentDir}${path}`);

			mpdClient.sendCommand(`${constants.mpdPlaylistClear} "${itemId}"`, (err, msg) => {
				if (err) {
					console.log(err);
					reject(err);
				}
				if (!files) {
					reject();
				}
				addPlaylistItems(itemId, files);
				resolve();
			});
		}
		catch(e) {
			console.log(e);
		}
	});
}

const fixEncoding = (data) => {
	try {
		const encoding = jschardet.detect(data);
		if (encoding !== constants.mpdCharset) {
			data = iconv.decode(new Buffer(data), encoding);
		}
	} catch(e) {
	}
	return data;
}

const mediaController = {
	async playWebRadioItem(itemId, socket, serialPort) {
		console.log('playWebRadioItem', itemId);
		playWebRadioItem(itemId, socket, serialPort);
	},

	async playAudioPlaylistItem(itemId, isSetCurrentPlaylist) {
		console.log('playAudioPlaylistItem', itemId);
		if (isSetCurrentPlaylist) {
			setAppStateField(db, constants.dbStatusSelectedAudioPlayListId, parseInt(itemId, 10));
		}
		await loadAudioPlaylistItem(itemId);
		await playAudioPlaylistItem(itemId);
	},

	async playAudioTrackItem(itemId, socket, serialPort, isSetCurrentTrack) {
		console.log('playAudioTrackItem', itemId);
		if (isSetCurrentTrack) {
			await setCurrentTrack(itemId);
		}
		playAudioTrackItem(itemId, socket, serialPort);
	},

	stop() {
		stopMetaInfoUpdating();
		mpdClient.sendCommand(constants.mpdStop, () => {});
	},

	async addPlaylist(itemId) {
		console.log('addPlaylist', itemId);
		await addPlaylist(itemId);
	},

	async deletePlaylist(itemId) {
		console.log('deletePlaylist', itemId);
		deletePlaylist(itemId);
	},

	async rescanPlaylist(itemId, path) {
		console.log('rescanPlaylist', itemId, path);
		await rescanPlaylist(itemId, path);
	},
};

export default mediaController;
