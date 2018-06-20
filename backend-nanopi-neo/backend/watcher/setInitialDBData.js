import constants from '../constants';
import {
  getState,
  scanFolder,
} from './utils';

export default async function (db, dbName) {
  const state = await getState(db, dbName);

  if (state[constants.dbStatusSelectedAudioFolder] === constants.initialMediaFolder) {
    const doc = await db.getDocument(dbName, constants.dbDocumentAudioFolder);
    if (doc.data.state.length === 0) {
      scanFolder(db, dbName, constants.initialMediaFolder);
    }
  }
}
