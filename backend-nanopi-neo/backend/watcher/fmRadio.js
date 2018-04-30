import constants from '../constants';
import { dbDocumentWatcher } from './utils';
import serialController from '../controller/serialController';

export default async (dbUrl, dbName, serialPort) => {
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentFmRadio, (result) => {
    const newState = result.doc[constants.dbFieldState];
    serialController.sendFmCount(serialPort, newState.length);
  });
};
