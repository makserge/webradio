'use strict';
import config from './config';
import constants from './constants';
//import dblite from 'dblite';
import * as fs from 'async-file';
import path from 'path';
//const exec = require('co-exec');

//dblite.bin = config.sqlite;
//const db = dblite(config.sqliteDb);

const processor = {
	async getInitialStatus() {
		log('getInitialStatus()');
		return await dbKeyValueQuery('SELECT key, value FROM ' + constants.dbTableStatus);
	},

	async processSerialData(socket, data) {
		data = data.replace(/\u0000/g, "");
		log('processSerialData()', data);
		if (data.length == 0) {
			log('Empty serial data');
			return;
		}
		const params = data.split(constants.serialDataDelimiter);
		if (params.length < 2) {
			log('Wrong serial data format');
			return;
		}
		const command = params[0];
		const value = params[1].trim();
/*
MUTE 0|1
MODE fm|network|mp3track|bt|linein|aplay
VOL 1-32
PRESET 1-30
NPRESET 1-9999
TRACK 1-9999
SLEEP 10-90 0|1
ALARM1 1 2 12 60 0 30 1  - mode preset vol timeout hour minute on
ALARM2 1 2 12 60 0 30 1
POWER 0|1
*/
		switch (command) {
			case constants.serialCommandMute:
				await processMute(socket, value);
				break;
			case constants.serialCommandMode:
				await processMode(socket, value);
				break;
			case constants.serialCommandVolume:
				await processVolume(socket, value);
				break;
			case constants.serialCommandFmPreset:
				await processFmPreset(socket, value);
				break;
			case constants.serialCommandNetPreset:
				await processNetPreset(socket, value);
				break;
			case constants.serialCommandPlayerTrack:
				await processPlayerTrack(socket, value);
				break;
			case constants.serialCommandSleepTimer:
				await processSleepTimer(socket, data);
				break;
			case constants.serialCommandAlarm1:
				await processAlarm1(socket, data);
				break;
			case constants.serialCommandAlarm2:
				await processAlarm2(socket, data);
				break;
			case constants.serialCommandPower:
				await processPower(socket, value);
				break;
			default:
				log('Wrong serial command', command);
		}
	}
};

async function processMute(socket, value) {
	log('processMute', value);
	await updateDbStatus(constants.dbStatusMute, value);

	const socketValue = (value == '1' ? constants.socketVolumeMuteOn : constants.socketVolumeMuteOff);
	sendStatusToSocket(socket, { [constants.socketVolumeMute]: socketValue });
}

async function processMode(socket, value) {
	log('processMode', value);
	await updateDbStatus(constants.dbStatusMode, value);

	sendStatusToSocket(socket, { [constants.socketMode]: value });
	playSelectedMode(value);
}

async function processVolume(socket, value) {
	log('processVolume', value);
	await updateDbStatus(constants.dbStatusVolume, value);

	sendStatusToSocket(socket, { [constants.socketVolume]: value });
}

async function processFmPreset(socket, value) {
	log('processFmPreset', value);
	await updateDbStatus(constants.dbStatusFmPreset, value);

	sendStatusToSocket(socket, { [constants.socketFmPreset]: value });

	playFmPreset(value);
}

async function processNetPreset(socket, value) {
	log('processNetPreset', value);
	await updateDbStatus(constants.dbStatusNetworkPreset, value);

	sendStatusToSocket(socket, { [constants.socketNetPreset]: value });

	playNetworkStream(value);
}

async function processPlayerTrack(socket, value) {
	log('processPlayerTrack', value);
	await updateDbStatus(constants.dbStatusPlayerTrack, value);

	sendStatusToSocket(socket, { [constants.socketPlayerTrack]: value });

	playPlayerTrack(value);
}

async function processSleepTimer(socket, data) {
	log('processSleepTimer', value);

	const params = data.split(constants.serialDataDelimiter);
	const value = params[1] + ' ' + params[2];

	await updateDbStatus(constants.dbStatusSleepTimer, value);

	const socketData = {
		[constants.socketSleepTimerInterval]: params[1],
		[constants.socketSleepTimerOn]: params[2]
	};
	sendStatusToSocket(socket, { [constants.socketSleepTimer]: socketData });
}

async function processAlarm1(socket, data) {
	log('processAlarm1', value);

	const params = data.split(constants.serialDataDelimiter);
	const value = params[1] + ' ' + params[2] + ' ' + params[3] + ' ' + params[5] + ' ' + params[5] + ' ' + params[6] + ' ' + params[7];

	await updateDbStatus(constants.dbStatusAlarm1, value);

	const socketData = {
		[constants.socketAlarm1Mode]: params[1],
		[constants.socketAlarm1Preset]: params[2],
		[constants.socketAlarm1Volume]: params[3],
		[constants.socketAlarm1Timeout]: params[4],
		[constants.socketAlarm1Hour]: params[5],
		[constants.socketAlarm1Min]: params[6],
		[constants.socketAlarm1On]: params[7]
	};
	sendStatusToSocket(socket, { [constants.socketAlarm1]: socketData });

	updateCronForAlarm(value);
}

async function processAlarm2(socket, data) {
	log('processAlarm2', value);

	const params = data.split(constants.serialDataDelimiter);
	const value = params[1] + ' ' + params[2] + ' ' + params[3] + ' ' + params[5] + ' ' + params[5] + ' ' + params[6] + ' ' + params[7];

	await updateDbStatus(constants.dbStatusAlarm2, value);

	const socketData = {
		[constants.socketAlarm2Mode]: params[1],
		[constants.socketAlarm2Preset]: params[2],
		[constants.socketAlarm2Volume]: params[3],
		[constants.socketAlarm2Timeout]: params[4],
		[constants.socketAlarm2Hour]: params[5],
		[constants.socketAlarm2Min]: params[6],
		[constants.socketAlarm2On]: params[7]
	};

	sendStatusToSocket(socket, { [constants.socketAlarm2]: socketData });

	updateCronForAlarm(value);
}

async function processPower(socket, value) {
	log('processPower', value);
	await updateDbStatus(constants.dbStatusPower, value);

	sendStatusToSocket(socket, { [constants.socketPower]: value });
}

function playSelectedMode(mode) {
	log('play selected mode here', mode);
}

function playFmPreset(item) {
	log('play fm preset here', item);
}

function playNetworkStream(item) {
	log('play net stream here', item);
}

function playPlayerTrack(item) {
	log('play track here', item);
}

function updateCronForAlarm(data) {
	log('update alarm cron task here', data);
}

async function dbKeyValueQuery(query) {
  return new Promise(function(resolve, reject) {
		/*
	  db.query(query, ['key', 'value'],
		function (rows) {
			let result = {};
			for (let index in rows) {
				result[rows[index].key] = rows[index].value;
			}
			resolve(result);
		}
	);*/
		resolve({});
  });
}

async function updateDbStatus(dbKey, value) {
	//await db.query('UPDATE ' + constants.dbTableStatus + ' SET value = ? WHERE key = ?', [value, dbKey]);
	await 1;
}

function sendStatusToSocket(socket, data) {
	sendDataToSocket(socket, constants.socketStatusKey, data);
}

function sendDataToSocket(socket, key, data) {
	socket.broadcast(key, {data: data});
	log(key, data);
}

function log(key, data) {
	if (config.debug == 1) {
		if (data) {
			console.log(key, data);
		}
		else {
			console.log(key);
		}
	}
}

module.exports = processor;
