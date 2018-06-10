import constants from '../constants';
import config from '../config';
import process from '../controller/mqttController';
import { sendLog } from './utils';

export default (db, mqttClient) => {
  mqttClient.on('connect', () => {
    sendLog('Connected to MQTT broker:', config.mqttHost);
    mqttClient.subscribe(constants.mqttSubscribeTopic);
  });

  mqttClient.on('error', () => {
    sendLog('Couldn\'t connect to MQTT broker:', config.mqttHost);
  });

  mqttClient.on('message', async function (topic, message) {
    await process(db, topic, message);
  });
};
