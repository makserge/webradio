import config from '../config';
import appState from './appState';
import audioPlaylist from './audioPlaylist';
import alarm from './alarm';
import webRadio from './webRadio';
import fmRadio from './fmRadio';
import dabRadio from './dabRadio';
import audioTrack from './audioTrack';

export default async function (db, socket, serialController, mqttClient) {
  await appState(db, config.couchDbUrl, config.couchDbName, socket, serialController, mqttClient);
  await audioPlaylist(db, config.couchDbUrl, config.couchDbName, socket);
  await alarm(config.couchDbUrl, config.couchDbName, serialController);
  await webRadio(config.couchDbUrl, config.couchDbName, socket, serialController);
  await fmRadio(config.couchDbUrl, config.couchDbName, serialController);
  await dabRadio(config.couchDbUrl, config.couchDbName, serialController);
  await audioTrack(config.couchDbUrl, config.couchDbName, socket, serialController);
}
