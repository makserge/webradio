import config from '../config';
import appState from './appState';
import audioPlaylist from './audioPlaylist';
import alarm from './alarm';
import webRadio from './webRadio';
import fmRadio from './fmRadio';
import audioTrack from './audioTrack';

export default async (db, socket, serialPort) => {
  await appState(db, config.couchDbUrl, config.couchDbName, socket, serialPort);
  await audioPlaylist(db, config.couchDbUrl, config.couchDbName, socket, serialPort);
  await alarm(config.couchDbUrl, config.couchDbName, serialPort);
  await webRadio(config.couchDbUrl, config.couchDbName, socket, serialPort);
  await fmRadio(config.couchDbUrl, config.couchDbName, serialPort);
  await audioTrack(config.couchDbUrl, config.couchDbName, socket, serialPort);
};
