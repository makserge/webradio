import config from '../config';
import constants from '../constants';
import { dbDocumentWatcher } from './utils';

export default async(db, dbUrl, dbName, socket, serialPort) => {
	let state = {};

	try {
		const doc = await db.getDocument(dbName, constants.dbDocumentAudioPlaylist);
		if (doc.data[constants.dbFieldState]) {
			state = doc.data[constants.dbFieldState];
		}
	}
	catch(e) {
	}
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAudioPlaylist, async(result) => {
		const newState = result.doc[constants.dbFieldState];
		const changedObjects = getObjectDiff(state, newState, constants.dbFieldTitle, constants.dbFieldValue);
		for (let item of changedObjects) {
			const id = item.item[constants.dbId];
			const path = item.item[constants.dbFieldValue];
			if (item.action === 'add') {
				await mediaController.addPlaylist(id);
				await mediaController.rescanPlaylist(id, path);
				await mediaController.playAudioPlaylistItem(id, true);
				mediaController.playAudioTrackItem(1, socket, serialPort, true);
			}
			else if (item.action === 'delete') {
				await mediaController.stop();
				await mediaController.deletePlaylist(id);
			}
			else if (item.action === 'rescan') {
				await mediaController.stop();
				await mediaController.rescanPlaylist(id, path);
			}
		}
		state = newState;
  });
}
