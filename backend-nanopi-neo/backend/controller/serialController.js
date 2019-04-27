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

const modeMap = {
  web: constants.modeWebRadio,
  fm: constants.modeFmRadio,
  dab: constants.modeDabRadio,
  player: constants.modeAudioPlayer,
  bt: constants.modeBluetooth,
  aplay: constants.modeAirPlay,
  linein: constants.modeLineIn,
};

export default class serialController {
  constructor(serialPort, delimiter) {
    this.serialPort = serialPort;
    this.delimiter = delimiter;
  }

  writePort(command, value) {
    let data;
    if (value instanceof Array) {
      data = value.map((item) => {
        if (typeof (item) === 'boolean') {
          return item ? 1 : 0;
        }
        return item;
      }).join(this.delimiter);
    } else if (typeof (value) === 'boolean') {
      data = value ? 1 : 0;
    } else {
      data = value;
    }
    const output = `${command}${this.delimiter}${data}\r\n`;
    sendLog('writePort', output);
    this.serialPort.write(output);
  }

  sendPower(value) {
    sendLog('sendPower()', value);
    this.writePort(
      constants.serialSendCommandPower,
      value,
    );
  }

  sendVolume(value) {
    sendLog('sendVolume()', value);
    this.writePort(
      constants.serialSendCommandVolume,
      value,
    );
  }

  sendMode(value) {
    sendLog('sendMode()', value);
    this.writePort(
      constants.serialSendCommandMode,
      value,
    );
  }

  sendVolumeMute(value) {
    sendLog('sendVolumeMute()', value);
    this.writePort(
      constants.serialSendCommandMute,
      value,
    );
  }

  sendWebRadioItem(value) {
    sendLog('sendWebRadioItem()', value);
    this.writePort(
      constants.serialSendCommandPreset,
      value,
    );
  }

  sendFmRadioItem(value) {
    sendLog('sendFmRadioItem()', value);
    this.writePort(
      constants.serialSendCommandPreset,
      value,
    );
  }

  sendAudioPlayerItem(value) {
    sendLog('sendAudioPlayerItem()', value);
    this.writePort(
      constants.serialSendCommandPreset,
      value,
    );
  }

  sendAudioPlayerElapsedTime(value) {
    sendLog('sendAudioPlayerElapsedTime()', value);
    this.writePort(
      constants.serialSendCommandTrackTime,
      value,
    );
  }

  sendSleepTimerTime(value) {
    sendLog('sendSleepTimerTime()', value);
    this.writePort(
      constants.serialSendCommandSleepTimer,
      value,
    );
  }

  sendSleepTimer(value) {
    sendLog('sendSleepTimer()', value);
    this.writePort(
      constants.serialSendCommandSleepTimerOn,
      value,
    );
  }

  sendWebCount(value) {
    sendLog('sendWebCount()', value);
    this.writePort(
      constants.serialSendCommandWebCount,
      value,
    );
  }

  sendFmCount(value) {
    sendLog('sendFmCount()', value);
    this.writePort(
      constants.serialSendCommandFmCount,
      value,
    );
  }

  sendDabCount(value) {
    sendLog('sendDabCount()', value);
    this.writePort(
      constants.serialSendCommandDabCount,
      value,
    );
  }

  sendFmRadioFrequency(value) {
    sendLog('sendFmRadioFrequency()', value);
    this.writePort(
      constants.serialSendCommandFmFreq,
      value,
    );
  }

  sendPlayerCount(value) {
    sendLog('sendPlayerCount()', value);
    this.writePort(
      constants.serialSendCommandPlayerCount,
      value,
    );
  }

  sendAlarm1(value) {
    sendLog('sendAlarm1()', value);
    this.writePort(
      constants.serialSendCommandAlarm1,
      value,
    );
  }

  sendAlarm2(value) {
    sendLog('sendAlarm2()', value);
    this.writePort(
      constants.serialSendCommandAlarm2,
      value,
    );
  }

  sendStatus(value) {
    sendLog('sendStatus()', value);
    this.writePort(
      constants.serialSendCommandStatus,
      value,
    );
  }

  sendTime() {
    const date = new Date();
    const value = `${date.getFullYear()}~${(date.getMonth() + 1)}~${date.getDate()}~${date.getHours()}~${date.getMinutes()}~${date.getSeconds()}`;
    sendLog('sendTime()', value);
    this.writePort(
      constants.serialSendCommandDate,
      value,
    );
  }

  sendFmSeek(value) {
    sendLog('sendSleepTimer()', value);
    this.writePort(
      constants.serialSendCommandFmSeek,
      value,
    );
  }

  async process(db, socket, mqttClient, data) {
    // eslint-disable-next-line no-control-regex
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
        await this.writePort(setVolumeMute(db, value === '1'));
        break;
      case constants.serialCommandMode:
        await setMode(db, modeMap(value));
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
  }
}
