import constants from '../constants';
import config from '../config';
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

export default async function (db, topic, value) {
  sendLog('MQTT process', `${topic}, ${value}`);
  if (topic.length === 0 || topic.value === 0) {
    sendLog('mqttController', 'Wrong MQTT data');
    return;
  }
  const command = topic.replace(`${config.mqttTopic}/`, '');
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
  const params = value.split(constants.mqttDataDelimiter);
  switch (command) {
    case constants.mqttCommandMute:
      await setVolumeMute(db, value === '1');
      break;
    case constants.mqttCommandMode:
      await setMode(db, mapMode(value));
      break;
    case constants.mqttCommandVolume:
      await setVolume(db, parseInt(value, 10));
      break;
    case constants.mqttCommandWebPreset:
      await setWebRadioSelect(db, parseInt(value, 10));
      break;
    case constants.mqttCommandFmPreset:
      await setFmRadioSelect(db, parseInt(value, 10));
      break;
    case constants.mqttCommandPlayerTrack:
      await setPlayerTrack(db, parseInt(value, 10));
      break;
    case constants.mqttCommandSleepTimer:
      if (params.length === 2) {
        await setSleepTimer(db, parseInt(params[0], 10), params[1].trim() === '1');
      }
      break;
    case constants.mqttCommandAlarm1:
      await setAlarm1(db, value === '1');
      break;
    case constants.mqttCommandAlarm2:
      await setAlarm2(db, value === '1');
      break;
    case constants.mqttCommandPower:
      await setPower(db, value === '1');
      break;
    default:
      sendLog('mqttController', `Wrong MQTT command: ${command}`);
  }
}
