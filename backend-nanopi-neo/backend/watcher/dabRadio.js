import constants from '../constants';
import { dbDocumentWatcher } from './utils';

export default async function (dbUrl, dbName, serialController) {
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentDabRadio, (result) => {
    const newState = result.doc[constants.dbFieldState];
    serialController.sendDabCount(newState.length);
  });
}
