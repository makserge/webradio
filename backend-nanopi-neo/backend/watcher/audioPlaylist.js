import constants from '../constants';
import {
  stop,
  clearPlaylist,
  rescanPlaylist,
  addPlaylist,
  deletePlaylist,
} from '../controller/mediaController';
import {
  dbDocumentWatcher,
  getObjectDiff,
  sendLog,
  updateAudioPlaylistProgressAndCount,
} from './utils';

/* eslint-disable func-names, prefer-arrow-callback, no-await-in-loop */
export default async function (db, dbUrl, dbName, socket) {
  let state = {};

  try {
    const doc = await db.get(constants.dbDocumentAudioPlaylist);
    if (doc[constants.dbFieldState]) {
      state = doc[constants.dbFieldState];
    }
  } catch (e) {
    sendLog('audioPlaylist', e);
    return;
  }
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAudioPlaylist, async function (result) {
    const newState = result.doc[constants.dbFieldState];
    const changedObjects = getObjectDiff(
      state,
      newState,
      constants.dbFieldFolders,
    );
    await stop(socket);
    for (const item of changedObjects) {
      const id = item.item[constants.dbId];
      const folders = item.item[constants.dbFieldFolders];
      let count = 0;
      if (item.action === 'add') {
        await addPlaylist(id);
        if (folders.length > 0) {
          count = await rescanPlaylist(id, folders);
        }
        updateAudioPlaylistProgressAndCount(db, id, count);
      } else if (item.action === 'delete') {
        await deletePlaylist(id);
      } else if (item.action === 'rescan') {
        if (folders.length > 0) {
          count = await rescanPlaylist(id, folders);
        } else {
          await clearPlaylist(id);
        }
        updateAudioPlaylistProgressAndCount(db, id, count);
      }
    }
    state = newState;
  });
}
