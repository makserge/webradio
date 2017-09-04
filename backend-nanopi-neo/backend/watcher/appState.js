import constants from '../constants';
import {
  dbDocumentWatcher,
  checkDbFieldChanges,
  getObjectDiff
} from './utils';

import sleepTimer from './sleepTimer';
import mediaController from '../controller/mediaController';
import serialController from '../controller/serialController';

const getState = async(db, dbName) => {
	let state = {};

	try {
		const doc = await db.getDocument(dbName, constants.dbDocumentAppState);
		if (doc.data[constants.dbFieldState]) {
			state = doc.data[constants.dbFieldState];
		}
	}
	catch(e) {
		state[constants.dbStatusPower] = false;
    state[constants.dbStatusSleepTimerOn] = false;
		state[constants.dbStatusSelectedWebRadioId] = 1;
		state[constants.dbStatusSelectedAudioPlayListId] = 0;
		state[constants.dbStatusSelectedAudioTrackId] = 0;
	}
	return state;
}

const playSelected = async(socket, db, dbName, mode) => {
	if (mode === constants.modeWebRadio) {
		const state = await getState(db, dbName);
		const selectedId = state[constants.dbStatusSelectedWebRadioId];
		console.log('modeWebRadio', selectedId);
		mediaController.playWebRadioItem(selectedId, socket);
	}
	else if (mode === constants.modeAudioPlayer) {
		const state = await getState(db, dbName);
		const selectedPlaylistId = state[constants.dbStatusSelectedAudioPlayListId];
		const selectedTrackId = state[constants.dbStatusSelectedAudioTrackId];
		console.log('modeAudioPlayer', selectedPlaylistId, selectedTrackId);
		await mediaController.playAudioPlaylistItem(selectedPlaylistId, false);
		mediaController.playAudioTrackItem(selectedTrackId, socket, false);
	}
}

const doPower = async(enabled, socket, db, dbName) => {
  console.log('doPower', enabled);
  if (enabled) {
    //const mode = await getMode(db, dbName);
    //playSelected(socket, db, dbName, mode);
  }
  else {
    mediaController.stop();
  }
  serialController.sendPower(enabled);
}

export const initAppStateChangesWatcher = async(db, dbUrl, dbName, socket) => {
	let state = await getState(db, dbName);

  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAppState, (result) => {
	  const newState = result.doc[constants.dbFieldState];

	  const power = checkDbFieldChanges(constants.dbStatusPower, state, newState);
    if (power !== null) {
	    if (!power) {
        sleepTimer.set(db, false);
      }
      doPower(power, socket, db, dbName);
			state = newState;
		}

		const item = checkDbFieldChanges(constants.dbStatusSelectedWebRadioId, state, newState);
    if (item !== null) {
			mediaController.playWebRadioItem(item, socket);
			state = newState;
		}

		const playlist = checkDbFieldChanges(constants.dbStatusSelectedAudioPlayListId, state, newState);
    if (playlist !== null) {
			mediaController.playAudioPlaylistItem(playlist, false);
			mediaController.playAudioTrackItem(1, socket, true);
			state = newState;
		}

		const track = checkDbFieldChanges(constants.dbStatusSelectedAudioTrackId, state, newState);
    if (track !== null) {
			mediaController.playAudioTrackItem(track, socket, false);
			state = newState;
		}

    const sleepTimerTime = checkDbFieldChanges(constants.dbStatusSleepTimerOn, state, newState);
    if (sleepTimerTime !== null) {
	    console.log(constants.dbStatusSleepTimerOn, sleepTimerTime);
      sleepTimer.start(sleepTimerTime, newState[constants.dbStatusSleepTimer], socket, db);
			state = newState;
		}
  });
}

export const initModeChangesWatcher = async(db, dbUrl, dbName, socket) => {
	let mode;

	try {
		const doc = await db.getDocument(dbName, constants.dbDocumentNavigation);
		if (doc.data[constants.dbFieldState]) {
			mode = doc.data[constants.dbFieldState][constants.dbFieldRoutes][0][constants.dbFieldIndex];
		}
	}
	catch(e) {
	}
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentNavigation, (result) => {
		const newMode = result.doc[constants.dbFieldState][constants.dbFieldRoutes][0][constants.dbFieldIndex];
		if (newMode != mode) {
			mode = newMode;
			console.log('mode', newMode);
			mediaController.stop();
			playSelected(socket, db, dbName, mode);
		}
  });
}
