import constants from '../constants';
import { dbDocumentWatcher } from './utils';

export default async (dbUrl, dbName, serialController) => {
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentFmRadio, (result) => {
    const newState = result.doc[constants.dbFieldState];
    serialController.sendFmCount(newState.length);
  });
};
