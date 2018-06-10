import constants from '../constants';
import { dbDocumentWatcher } from './utils';
import serialController from '../controller/serialController';
import mediaController from '../controller/mediaController';

export default async function (dbUrl, dbName, socket, serialPort) {
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAudioTrack, (result) => {
    const newState = result.doc[constants.dbFieldState];
    serialController.sendPlayerCount(serialPort, newState.length);
    mediaController.stop(socket);
  });
};
