import config from '../config';
import constants from '../constants';
import { dbDocumentWatcher } from './utils';
import serialController from '../controller/serialController';

export default async(dbUrl, dbName, serialPort) => {
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentWebRadio, (result) => {
    const newState = result.doc[constants.dbFieldState];
    serialController.sendWebCount(serialPort, newState.length);
	});
}
