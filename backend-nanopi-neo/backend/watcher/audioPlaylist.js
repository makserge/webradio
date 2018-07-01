import constants from '../constants';
import mediaController from '../controller/mediaController';
import {
  dbDocumentWatcher,
  getObjectDiff,
  sendLog,
} from './utils';

/* eslint-disable func-names, prefer-arrow-callback, no-await-in-loop */
export default async function (db, dbUrl, dbName, socket) {
  let state = {};

  try {
    const doc = await db.getDocument(dbName, constants.dbDocumentAudioPlaylist);
    if (doc.data[constants.dbFieldState]) {
      state = doc.data[constants.dbFieldState];
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
    await mediaController.stop(socket);
    for (const item of changedObjects) {
      console.log(item);
      const id = item.item[constants.dbId];
      const folders = item.item[constants.dbFieldFolders];
      if (item.action === 'add') {
        await mediaController.addPlaylist(id);
        if (folders.length > 0) {
          await mediaController.rescanPlaylist(id, folders);
        }
      } else if (item.action === 'delete') {
        await mediaController.deletePlaylist(id);
      } else if (item.action === 'rescan') {
        if (folders.length > 0) await mediaController.rescanPlaylist(id, folders);
      }
    }
    state = newState;
  });
}
