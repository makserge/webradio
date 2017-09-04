import config from '../config';
import { initAppStateChangesWatcher, initModeChangesWatcher } from './appState';
import { initAudioPlayListWatcher } from './audioPlaylist';
import { initAlarmChangesWatcher } from './alarm';

export default async(db, socket) => {
  await initAppStateChangesWatcher(db, config.couchDbUrl, config.couchDbName, socket);
  await initModeChangesWatcher(db, config.couchDbUrl, config.couchDbName, socket);
  await initAudioPlayListWatcher(db, config.couchDbUrl, config.couchDbName, socket);
  await initAlarmChangesWatcher(config.couchDbUrl, config.couchDbName);
}
