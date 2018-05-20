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
} from '../watcher/utils';

const mapMode = (mode) => {
  switch (mode) {
    case 'webradio':
      return constants.modeWebRadio;
    case 'fmradio':
      return constants.modeFmRadio;
    case 'player':
      return constants.modeAudioPlayer;
    case 'bluetooth':
      return constants.modeBluetooth;
    case 'airplay':
      return constants.modeAirPlay;
    case 'linein':
      return constants.modeLineIn;
    default:
      return constants.modeWebRadio;
  }
};

const checkNumberValue = (value) => {
  return Number.isInteger(value);
};

export default async function (db, topic, value) {
  let data;
  try {
    data = JSON.parse(value);
  } catch (error) {
    sendLog('mqttController', `Wrong MQTT data: ${error}`);
    return;
  }
  sendLog('MQTT process', `${topic}, ${data}, ${data.value}`);
  if (topic.length === 0 || topic.value === 0) {
    sendLog('mqttController', 'Wrong MQTT data');
    return;
  }
  const command = topic.replace(`${constants.mqttTopic}/`, '');
  if (command.length === 0) {
    sendLog('mqttController', 'Wrong MQTT command');
    return;
  }
  /*
mute 0|1
mode webradio|fmradio|player|bluetooth|airplay|linein
volume 1-32
webpreset 1-9999
fmpreset 1-30
track 1-99999
sleep 15-90 0|1
alarm1 0|1
alarm2 0|1
power 0|1
*/
  switch (command) {
    case constants.mqttCommandMute:
      if (checkNumberValue(data.value)) {
        await setVolumeMute(db, data.value === 1);
      }
      break;
    case constants.mqttCommandMode:
      if (data.value) {
        await setMode(db, mapMode(data.value));
      }
      break;
    case constants.mqttCommandVolume:
      if (checkNumberValue(data.value)) {
        await setVolume(db, data.value);
      }
      break;
    case constants.mqttCommandWebPreset:
      if (checkNumberValue(data.value)) {
        await setWebRadioSelect(db, data.value);
      }
      break;
    case constants.mqttCommandFmPreset:
      if (checkNumberValue(data.value)) {
        await setFmRadioSelect(db, data.value);
      }
      break;
    case constants.mqttCommandPlayerTrack:
      if (checkNumberValue(data.value)) {
        await setPlayerTrack(db, data.value);
      }
      break;
    case constants.mqttCommandSleepTimer:
      if (checkNumberValue(data.time) && checkNumberValue(data.value)) {
        await setSleepTimer(db, data.time, data.value === 1);
      }
      break;
    case constants.mqttCommandAlarm1:
      if (checkNumberValue(data.value)) {
        await setAlarm1(db, data.value === 1);
      }
      break;
    case constants.mqttCommandAlarm2:
      if (checkNumberValue(data.value)) {
        await setAlarm2(db, data.value === 1);
      }
      break;
    case constants.mqttCommandPower:
      if (checkNumberValue(data.value)) {
        await setPower(db, data.value === 1);
      }
      break;
    default:
      sendLog('mqttController', `Wrong MQTT command: ${command}`);
  }
}
