import constants from '../constants';
import {
  getState,
  scanFolder,
} from './utils';

export default async function (db) {
  const state = await getState(db);

  if (state[constants.dbStatusSelectedAudioFolder] === constants.initialMediaFolder) {
    const doc = await db.get(constants.dbDocumentAudioFolder);
    if (doc.state.length === 0) {
      scanFolder(db, constants.initialMediaFolder);
    }
  }
}
