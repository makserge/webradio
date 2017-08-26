'use strict';

import fs from 'fs';
import path from 'path';

import config from './config';
import constants from './constants';

const db = require('couchdb-promises')({
	baseUrl: config.couchDbUrl,
})

import mpd from 'mpd';

const mpdClient = mpd.connect({
	port: config.mpdPort,
	host: config.mpdHost
});

const TIME_POLLING_INTERVAL = 1000; // 1 sec
const TITLE_POLLING_INTERVAL = 1000; // 1 sec

let timeTimer;
let titleTimer;

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

const getTitle = () => {
	return new Promise((resolve, reject) => {
		mpdClient.sendCommand(constants.mpdCurrentSong, (err, msg) => {
			if (err) {
				reject();
			}
			const info = msg.split('\n');
			if (info.length > 1) {
				const title = info[1].replace(/Title: (.*)/, '$1');
				resolve(title);
			}
			reject();
		});
	});
};

const getStatus = () => {
	return new Promise((resolve, reject) => {
		mpdClient.sendCommand(constants.mpdStatus, (err, msg) => {
			if (err) {
				reject();
			}

			let elapsedTime = '00:00';
			let totalTime = '00:00';
			let bitrate = '0';
			let format = '';

			const info = msg.split('\n').join('|');
			let matches = info.match(/time: ([^\|]+)\|/);
			if (matches) {
				const time = matches[1];
				const timeArray = time.split(':');
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

			const data = {
				elapsedTime: elapsedTime,
				totalTime: totalTime,
				bitrate: bitrate,
				format: format
			};
			resolve(data);
		});
	});
};

const startMetaInfoUpdating = (socket) => {
	if (titleTimer) {
		clearInterval(titleTimer);
	}
	let title = '';
	let oldTitle;
	titleTimer = setInterval(async function() {
		try {
			title = await getTitle(oldTitle, title);
			if (title != oldTitle) {
				oldTitle = title;
			}
		}
		catch(e) {
		}
	}, TITLE_POLLING_INTERVAL);

	if (timeTimer) {
		clearInterval(timeTimer);
	}
	timeTimer = setInterval(async function() {
		const data = await getStatus();
		const titleArray = title.split(' - ');
		data.artist = titleArray[0];
		data.song = titleArray[1] || '';

		//console.log(socket.connections.size, data);
		if (data.format) {
			socket.broadcast(constants.socketMediaMetaInfo, data);
		}	

	}, TIME_POLLING_INTERVAL);
};

const sendMetaInfo = (socket) => {
	if (socket.connections.size) {
		startMetaInfoUpdating(socket);
	}

	socket.on('connection', async (ctx) => {
		console.log('Connect socket', ctx.socket.id);
		startMetaInfoUpdating(socket);
	});

	socket.on('disconnect', ctx => {
		console.log( 'Disconnect socket', ctx.socket.id);
		if (!socket.connections.size) {
			if (titleTimer) {
				clearInterval(titleTimer);
			}
			if (timeTimer) {
				clearInterval(timeTimer);
			}
		}
	});
};

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

const playWebRadioItem = async(itemId, socket) => {
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
		mpdClient.sendCommands(commandList, () => {});
		sendMetaInfo(socket);
	}
	catch(e) {
		console.log(e);
	}		
}

const playAudioPlaylistItem = async(itemId, socket) => {
	mpdClient.sendCommand(`${constants.mpdListPlaylistInfo} "${itemId}"`, async(err, msg) => {
		if (err) {
			console.log(err);
			return;
		}
		const files = msg.split('\n');
		let id = 0;
		let meta;
		let item;
		let matches;
		const items = [];
		for (meta of files) {
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
		}
		await db.createDocument(config.couchDbName, data, constants.dbDocumentAudioTrack);
	});
}	

const addPlaylist = (itemId) => {
	mpdClient.sendCommand(`${constants.mpdPlaylistSave} "${itemId}"`, (err, msg) => {
		if (err) {
			console.log(err);
			return err;
		}
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
	let item;
	for (item of items) {
		if (Array.isArray(item)) {
			addPlaylistItems(itemId, item);
		}
		else {	
			item = item.replace(`${config.contentDirMpd}/`, '');
			//console.log(`${constants.mpdPlaylistAdd} "${itemId}" "${item}"`);
			mpdClient.sendCommand(`${constants.mpdPlaylistAdd} "${itemId}" "${item}"`, (err, msg) => {
				if (err) {
					console.log(err);
					return err;
				}
			});
		}
	}
}	

const rescanPlaylist = async(itemId, path) => {
	try {
		console.log(`${config.contentDir}${path}`);
		const files = await walkContentFoldersTree(`${config.contentDir}${path}`);
		mpdClient.sendCommand(`${constants.mpdPlaylistClear} "${itemId}"`, (err, msg) => {
			if (err) {
				console.log(err);
				return err;
			}
			if (!files) {
				return;
			}
			addPlaylistItems(itemId, files);
		});
	}
	catch(e) {
		console.log(e);
	}	
}	

const mediaController = {
	async playWebRadioItem(itemId, socket) {
		console.log('playWebRadioItem', itemId);
		playWebRadioItem(itemId, socket);
	},
	
	async playAudioPlaylistItem(itemId, socket) {
		console.log('playAudioPlaylistItem', itemId);
		playAudioPlaylistItem(itemId, socket);
	},
	
	stop() {
		mpdClient.sendCommand(constants.mpdStop, () => {});	
	},

	async addPlaylist(itemId) {
		console.log('addPlaylist', itemId);
		addPlaylist(itemId);
	},
	
	async deletePlaylist(itemId) {
		console.log('deletePlaylist', itemId);
		deletePlaylist(itemId);
	},
	
	async rescanPlaylist(itemId, path) {
		console.log('rescanPlaylist', itemId, path);
		rescanPlaylist(itemId, path);
	},
};

module.exports = mediaController;