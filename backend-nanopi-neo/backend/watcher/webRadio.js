import constants from '../constants';
import { dbDocumentWatcher } from './utils';
import { stop, updateWebRadioPlaylist } from '../controller/mediaController';

export default (dbUrl, dbName, socket, serialController) => {
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentWebRadio, async (result) => {
    const newState = result.doc[constants.dbFieldState];
    serialController.sendWebCount(newState.length);
    await stop(socket);
    updateWebRadioPlaylist(newState);
  });
};
