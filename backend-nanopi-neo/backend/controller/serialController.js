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
  sendLog,
  sendRdsPs,
  sendRdsRt,
  sendFmFreq,
  sendFmStatus,
} from '../watcher/utils';

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
    default:
      return constants.modeWebRadio;
  }
};

const writePort = (serialPort, delimiter, command, value) => {
  let data;
  if (value instanceof Array) {
    data = value.map((item) => {
      if (typeof (item) === 'boolean') {
        return item ? 1 : 0;
      }
      return item;
    }).join(delimiter);
  } else if (typeof (value) === 'boolean') {
    data = value ? 1 : 0;
  } else {
    data = value;
  }
  const output = `${command}${delimiter}${data}\r\n`;
  sendLog('writePort', output);
  serialPort.write(output);
};

const serialController = {
  sendPower(serialPort, value) {
    sendLog('sendPower()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandPower,
      value,
    );
  },

  sendVolume(serialPort, value) {
    sendLog('sendVolume()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandVolume,
      value,
    );
  },

  sendMode(serialPort, value) {
    sendLog('sendMode()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandMode,
      value,
    );
  },

  sendVolumeMute(serialPort, value) {
    sendLog('sendVolumeMute()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandMute,
      value,
    );
  },

  sendWebRadioItem(serialPort, value) {
    sendLog('sendWebRadioItem()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandPreset,
      value,
    );
  },

  sendFmRadioItem(serialPort, value) {
    sendLog('sendFmRadioItem()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandPreset,
      value,
    );
  },

  sendAudioPlayerItem(serialPort, value) {
    sendLog('sendAudioPlayerItem()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandPreset,
      value,
    );
  },

  sendAudioPlayerElapsedTime(serialPort, value) {
    sendLog('sendAudioPlayerElapsedTime()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandTrackTime,
      value,
    );
  },

  sendSleepTimerTime(serialPort, value) {
    sendLog('sendSleepTimerTime()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandSleepTimer,
      value,
    );
  },

  sendSleepTimer(serialPort, value) {
    sendLog('sendSleepTimer()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandSleepTimerOn,
      value,
    );
  },

  sendWebCount(serialPort, value) {
    sendLog('sendWebCount()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandWebCount,
      value,
    );
  },

  sendFmCount(serialPort, value) {
    sendLog('sendFmCount()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandFmCount,
      value,
    );
  },

  sendFmRadioFrequency(serialPort, value) {
    sendLog('sendFmRadioFrequency()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandFmFreq,
      value,
    );
  },

  sendPlayerCount(serialPort, value) {
    sendLog('sendPlayerCount()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandPlayerCount,
      value,
    );
  },

  sendAlarm1(serialPort, value) {
    sendLog('sendAlarm1()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandAlarm1,
      value,
    );
  },

  sendAlarm2(serialPort, value) {
    sendLog('sendAlarm2()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandAlarm2,
      value,
    );
  },

  sendStatus(serialPort, value) {
    sendLog('sendStatus()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandStatus,
      value,
    );
  },

  sendTime(serialPort) {
    const date = new Date();
    const value = `${date.getFullYear()}~${(date.getMonth() + 1)}~${date.getDate()}~${date.getHours()}~${date.getMinutes()}~${date.getSeconds()}`;
    sendLog('sendTime()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandDate,
      value,
    );
  },

  sendFmSeek(serialPort, value) {
    sendLog('sendSleepTimer()', value);
    writePort(
      serialPort,
      constants.serialSendDelimiter,
      constants.serialSendCommandFmSeek,
      value,
    );
  },

  async process(db, socket, mqttClient, data) {
    data = data.replace(/\u0000/g, '');
    sendLog('process()', data);
    if (data.length === 0) {
      sendLog('process()', 'Empty serial data');
      return;
    }
    const params = data.split(constants.serialDataDelimiter);
    if (params.length < 2) {
      sendLog('process()', 'Wrong serial data format');
      return;
    }
    const command = params[0];
    const value = params[1].trim();
    sendLog('process()', `${command}, ${value}`);
    /*
MUTE 0|1
MODE web|fm|player|bt|aplay|linein
VOL 1-32
WPRESET 1-9999
PRESET 1-30
TRACK 1-99999
SLEEP 15-90 0|1
ALARM1 0|1
ALARM2 0|1
POWER 0|1
FMPREQ 650-1080
RDSPS text
RDSRT text
*/
    switch (command) {
      case constants.serialCommandMute:
        await setVolumeMute(db, value === '1');
        break;
      case constants.serialCommandMode:
        await setMode(db, mapMode(value));
        break;
      case constants.serialCommandVolume:
        await setVolume(db, parseInt(value, 10));
        break;
      case constants.serialCommandWebPreset:
        await setWebRadioSelect(db, parseInt(value, 10));
        break;
      case constants.serialCommandFmPreset:
        await setFmRadioSelect(db, parseInt(value, 10));
        break;
      case constants.serialCommandPlayerTrack:
        await setPlayerTrack(db, parseInt(value, 10));
        break;
      case constants.serialCommandSleepTimer:
        await setSleepTimer(db, parseInt(params[1], 10), params[2].trim() === '1');
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
      case constants.serialCommandRdsPS:
        await sendRdsPs(socket, mqttClient, value);
        break;
      case constants.serialCommandRdsRT:
        await sendRdsRt(socket, mqttClient, value);
        break;
      case constants.serialCommandFmFreq:
        await sendFmFreq(socket, parseInt(value, 10));
        break;
      case constants.serialCommandFmStatus:
        await sendFmStatus(socket, params[1] === '1', params[2].trim());
        break;
      default:
        sendLog('process()', `Wrong serial command: ${command}`);
    }
  },
};

export default serialController;
