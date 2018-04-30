export default {
  debug: 1,
  port: 3000,
  contentDir: '/media',
  contentDirMpd: '',
  serialPort: '/dev/ttyS1',
  serialPortBaudRate: 9600,
  serialPortDelimiter: '\n',
  couchDbName: 'webradio',
  couchDbUrl: 'http://localhost:5984',
  mpdPort: 6600,
  mpdHost: 'localhost',
  alarmOnScriptPath: '/home/webradio/backend/console/alarm.js 1',
  alarmOffScriptPath: '/home/webradio/backend/console/alarm.js 0',
  socketHeartBeatTimeout: 4000,
  socketHeartBeatInterval: 2000,
  airPlayStartCommand: '/etc/init.d/shairport-sync start',
  airPlayStopCommand: '/etc/init.d/shairport-sync stop',
  mqttHost: 'mqtt://test.mosquitto.org',
  mqttPort: 1883,
  mqttUsername: '',
  mqttPassword: '',
  mqttTopic: 'webradio',
  mqttSubscribeTopic: 'webradio/#',
};
