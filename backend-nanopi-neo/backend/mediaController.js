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
				const time = matches[0].replace(/time: ([^\|]+)\|/, '$1');
				const timeArray = time.split(':');
				elapsedTime = formatTime(timeArray[0]);
				totalTime = formatTime(timeArray[1]);
			}

			matches = info.match(/bitrate: ([^\|]+)\|/);
			if (matches) {
				bitrate = matches[0].replace(/bitrate: ([^\|]+)\|/, '$1');
			}

			matches = info.match(/audio: ([^\|]+)\|/);
			if (matches) {
				format = matches[0].replace(/audio: ([^\|]+)\|/, '$1');
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

const mediaController = {
	async playWebRadioItem(itemId, socket) {
		console.log('playWebRadioItem', itemId);
		try {
			const doc = await db.getDocument(config.couchDbName, constants.dbDocumentWebRadio);
			if (!doc.data.state) {
				return;
			}
			const item = doc.data.state.filter((item) => {
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
	},
	
	stop() {
		mpdClient.sendCommand(constants.mpdStop, () => {});	
	},

	async addPlaylist(title) {
		console.log('addPlaylist', title);
		mpdClient.sendCommand(`${constants.mpdPlaylistSave} "${title}"`, (err, msg) => {
			if (err) {
				console.log(err);
				return err;
			}
		});
	},
	
	async deletePlaylist(title) {
		console.log('deletePlaylist', title);
		mpdClient.sendCommand(`${constants.mpdPlaylistRm} "${title}"`, (err, msg) => {
			if (err) {
				console.log(err);
				return err;
			}
		});
	},
	
	async renamePlaylist(oldTitle, newTitle) {
		console.log('renamePlaylist', oldTitle, newTitle);
		mpdClient.sendCommand(`${constants.mpdPlaylistRename} "${oldTitle}" "${newTitle}"`, (err, msg) => {
			if (err) {
				console.log(err);
				return err;
			}
		});
	},
	
	async rescanPlaylist(title, path) {
		console.log('rescanPlaylist', title, path);
		try {
			const files = await walkContentFoldersTree(`${config.contentDir}${path}`);
			mpdClient.sendCommand(`${constants.mpdPlaylistClear} "${title}"`, (err, msg) => {
				if (err) {
					console.log(err);
					return err;
				}
				if (!files) {
					return;
				}	
				for (let item of files) {
					item = item.replace(`${config.contentDir}/`, '');
					console.log(`${constants.mpdPlaylistAdd} "${title}" "${item}"`);
					mpdClient.sendCommand(`${constants.mpdPlaylistAdd} "${title}" "${item}"`, (err, msg) => {
						if (err) {
							console.log(err);
							return err;
						}
					});
				}	
			});
		}
		catch(e) {
			console.log(e);
		}
	},
};

module.exports = mediaController;