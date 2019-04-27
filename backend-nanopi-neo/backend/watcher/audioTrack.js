import constants from '../constants';
import { dbDocumentWatcher } from './utils';
import { stop } from '../controller/mediaController';

export default async function (dbUrl, dbName, socket, serialController) {
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAudioTrack, (result) => {
    const newState = result.doc[constants.dbFieldState];
    serialController.sendPlayerCount(newState.length);
    stop(socket);
  });
}
