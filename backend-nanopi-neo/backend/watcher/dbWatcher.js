import config from '../config';
import appState from './appState';
import audioPlaylist from './audioPlaylist';
import alarm from './alarm';

export default async(db, socket) => {
  await appState(db, config.couchDbUrl, config.couchDbName, socket);
  await audioPlaylist(db, config.couchDbUrl, config.couchDbName, socket);
  await alarm(config.couchDbUrl, config.couchDbName);
}
