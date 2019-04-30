import constants from '../constants';
import {
  getState,
  scanFolder,
} from './utils';

import { rescanAudioFolders } from '../controller/mediaController';

export default async function (db) {
  const state = await getState(db);

  if (state[constants.dbStatusSelectedAudioFolder] === constants.initialMediaFolder) {
    const doc = await db.get(constants.dbDocumentAudioFolder);
    if (doc.state.length === 0) {
      await rescanAudioFolders();
      scanFolder(db, constants.initialMediaFolder);
    }
  }
}
