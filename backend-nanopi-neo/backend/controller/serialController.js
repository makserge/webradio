import constants from '../constants';

const DELIMITER = '~';

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
	}

};

export default serialController;
