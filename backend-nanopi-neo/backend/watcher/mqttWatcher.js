import mqtt from 'mqtt';

import config from '../config';
import process from '../controller/mqttController';

export default (db) => {
  // const client  = mqtt.connect({
  //  host: config.mqttHost,
  //  port: config.mqttPort,
  //  username: config.mqttUsername,
  //  password: config.mqttPassword
  // });
  const client = mqtt.connect(config.mqttHost);

  client.on('connect', () => {
    console.log('Connected to MQTT broker:', config.mqttHost);
    client.subscribe(config.mqttSubscribeTopic);
  });

  client.on('error', () => {
    console.log('Couldn\'t connect to MQTT broker:', config.mqttHost);
  });

  client.on('message', async (topic, message) => {
    await process(db, topic, message.toString());
  });
};
