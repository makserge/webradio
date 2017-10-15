import constants from '../constants';

import {
	setVolumeMute,
	setVolume,
	setMode,
	setWebRadioSelect,
	setFmRadioSelect,
	setPlayerTrack,
	setSleepTimer,
	setAlarm1,
	setAlarm2,
	setPower,
} from '../watcher/utils';

const DELIMITER = '~';

const mapMode = (mode) => {
	switch (mode) {
		case 'web':
			return constants.modeWebRadio;
		case 'fm':
			return constants.modeFmRadio;
		case 'player':
			return constants.modeAudioPlayer;
		case 'bt':
			return constants.modeBluetooth;
		case 'aplay':
				return constants.modeAirPlay;
		case 'linein':
			return constants.modeLineIn;
	}
}

const writePort = (serialPort, command, value) => {
	let data;
	if (value instanceof Array) {
		data = value.map((item) => {
			if (typeof(item) === "boolean") {
				return item ? 1 : 0;
			}
			return item;
		}).join(DELIMITER);
	} else {
		if (typeof(value) === "boolean") {
			data = value ? 1 : 0;
		} else {
			data = value;
		}
	}
	serialPort.write(`${command}${DELIMITER}${data}\r\n`);
};

const serialController = {
	sendPower(serialPort, value) {
		console.log('sendPower', value);
		writePort(serialPort, constants.serialSendCommandPower, value);
	},

	sendVolume(serialPort, value) {
		console.log('sendVolume', value);
		writePort(serialPort, constants.serialSendCommandVolume, value);
	},

	sendMode(serialPort, value) {
		console.log('sendMode', value);
		writePort(serialPort, constants.serialSendCommandMode, value);
	},

	sendVolumeMute(serialPort, value) {
		console.log('sendVolumeMute', value);
		writePort(serialPort, constants.serialSendCommandMute, value);
	},

	sendWebRadioItem(serialPort, value) {
		console.log('sendWebRadioItem', value);
		writePort(serialPort, constants.serialSendCommandPreset, value);
	},

	sendFmRadioItem(serialPort, value) {
		console.log('sendFmRadioItem', value);
		writePort(serialPort, constants.serialSendCommandPreset, value);
	},

	sendAudioPlayerItem(serialPort, value) {
		console.log('sendAudioPlayerItem', value);
		writePort(serialPort, constants.serialSendCommandPreset, value);
	},

	sendAudioPlayerElapsedTime(serialPort, value) {
		console.log('sendAudioPlayerElapsedTime', value);
		writePort(serialPort, constants.serialSendCommandTrackTime, value);
	},

	sendSleepTimerTime(serialPort, value) {
		console.log('sendSleepTimerTime', value);
		writePort(serialPort, constants.serialSendCommandSleepTimer, value);
	},

	sendSleepTimer(serialPort, value) {
		console.log('sendSleepTimer', value);
		writePort(serialPort, constants.serialSendCommandSleepTimerOn, value);
	},

	sendWebCount(serialPort, value) {
		console.log('sendWebCount', value);
		writePort(serialPort, constants.serialSendCommandWebCount, value);
	},

	sendFmCount(serialPort, value) {
		console.log('sendFmCount', value);
		writePort(serialPort, constants.serialSendCommandFmCount, value);
	},

	sendFmRadioFrequency(serialPort, value) {
		console.log('sendFmRadioFrequency', value);
		writePort(serialPort, constants.serialSendCommandFmFreq, value);
	},

	sendPlayerCount(serialPort, value) {
		console.log('sendPlayerCount', value);
		writePort(serialPort, constants.serialSendCommandPlayerCount, value);
	},

	sendAlarm1(serialPort, value) {
		console.log('sendAlarm1', value);
		writePort(serialPort, constants.serialSendCommandAlarm1, value);
	},

	sendAlarm2(serialPort, value) {
		console.log('sendAlarm2', value);
		writePort(serialPort, constants.serialSendCommandAlarm2, value);
	},

	async process(db, data) {
    data = data.replace(/\u0000/g, "");
    console.log('process()', data);
    if (data.length == 0) {
      console.log('Empty serial data');
      return;
    }
    const params = data.split(constants.serialDataDelimiter);
    if (params.length < 2) {
      console.log('Wrong serial data format');
      return;
    }
    const command = params[0];
    const value = params[1].trim();
		console.log(command, value);
/*
MUTE 0|1
MODE web|fm|player|bt|aplay|linein
VOL 1-32
WPRESET 1-9999
PRESET 1-30
TRACK 1-9999
SLEEP 15-180 0|1
ALARM1 0|1
ALARM2 0|1
POWER 0|1
*/
    switch (command) {
      case constants.serialCommandMute:
        await setVolumeMute(db, value === '1');
        break;
      case constants.serialCommandMode:
        await setMode(db, mapMode(value));
        break;
      case constants.serialCommandVolume:
        await setVolume(db, parseInt(value));
        break;
			case constants.serialCommandWebPreset:
	      await setWebRadioSelect(db, parseInt(value));
	      break;
      case constants.serialCommandFmPreset:
        await setFmRadioSelect(db, parseInt(value));
        break;
      case constants.serialCommandPlayerTrack:
        await setPlayerTrack(db, parseInt(value));
        break;
      case constants.serialCommandSleepTimer:
        await setSleepTimer(db, parseInt(params[1]), params[2].trim() === '1');
        break;
      case constants.serialCommandAlarm1:
        await setAlarm1(db, value === '1');
        break;
      case constants.serialCommandAlarm2:
        await setAlarm2(db, value === '1');
        break;
      case constants.serialCommandPower:
        await setPower(db, value === '1');
        break;
      default:
        console.log('Wrong serial command', command);
    }
  }
};

export default serialController;
