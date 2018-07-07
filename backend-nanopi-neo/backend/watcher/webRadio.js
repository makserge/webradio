import constants from '../constants';
import { dbDocumentWatcher } from './utils';
import serialController from '../controller/serialController';
import mediaController from '../controller/mediaController';

/* eslint-disable func-names, prefer-arrow-callback */
export default (dbUrl, dbName, socket, serialPort) => {
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentWebRadio, async function (result) {
    const newState = result.doc[constants.dbFieldState];
    serialController.sendWebCount(serialPort, newState.length);
    await mediaController.stop(socket);
    mediaController.updateWebRadioPlaylist(newState);
  });
};
