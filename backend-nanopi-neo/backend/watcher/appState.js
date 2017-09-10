import constants from '../constants';
import {
  dbDocumentWatcher,
  checkDbFieldChanges,
  getObjectDiff
} from './utils';

import sleepTimer from './sleepTimer';
import mediaController from '../controller/mediaController';
import serialController from '../controller/serialController';

const getMode = async(db, dbName) => {
  let mode;
  try {
    const doc = await db.getDocument(dbName, constants.dbDocumentNavigation);
    if (doc.data[constants.dbFieldState]) {
      mode = doc.data[constants.dbFieldState][constants.dbFieldRoutes][0][constants.dbFieldIndex];
    }
  }
  catch(e) {
  }
  return mode;
}

const getPower = async(db, dbName) => {
  let state = await getState(db, dbName);
  return state[constants.dbStatusPower];
}

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
    const mode = await getMode(db, dbName);
    playSelected(socket, db, dbName, mode);
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

    const volume = checkDbFieldChanges(constants.dbStatusVolume, state, newState);
    if (volume !== null) {
	    serialController.sendVolume(volume);
			state = newState;
		}

    const volumeMute = checkDbFieldChanges(constants.dbStatusVolumeMute, state, newState);
    if (volumeMute !== null) {
      serialController.sendVolumeMute(volumeMute);
      state = newState;
    }

    const fmItem = checkDbFieldChanges(constants.dbStatusSelectedFmRadioId, state, newState);
    if (fmItem !== null) {
      serialController.sendFmRadioItem(fmItem);
      state = newState;
    }

    const sleepTimerTime = checkDbFieldChanges(constants.dbStatusSleepTimer, state, newState);
    if (sleepTimerTime !== null) {
      serialController.sendSleepTimerTime(sleepTimerTime);
      state = newState;
    }

		const webItem = checkDbFieldChanges(constants.dbStatusSelectedWebRadioId, state, newState);
    if (webItem !== null) {
      serialController.sendWebRadioItem(webItem);
			mediaController.playWebRadioItem(webItem, socket);
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
      serialController.sendAudioPlayerItem(track);
    	mediaController.playAudioTrackItem(track, socket, false);
    	state = newState;
		}

    const sleepTimerOn = checkDbFieldChanges(constants.dbStatusSleepTimerOn, state, newState);
    if (sleepTimerOn !== null) {
	    console.log(constants.dbStatusSleepTimerOn, sleepTimerOn);
      sleepTimer.start(sleepTimerOn, newState[constants.dbStatusSleepTimer], socket, db);
			state = newState;
		}
  });
}

export const initModeChangesWatcher = async(db, dbUrl, dbName, socket) => {
	let mode = await getMode(db, dbName);

  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentNavigation, async(result) => {
		const newMode = result.doc[constants.dbFieldState][constants.dbFieldRoutes][0][constants.dbFieldIndex];
    if (newMode != mode) {
			mode = newMode;
			console.log('mode', mode);
      serialController.sendMode(mode);
      const power = await getPower(db, dbName);
  		if (power) {
			   mediaController.stop();
			   playSelected(socket, db, dbName, mode);
      }
		}
  });
}

export default async(db, dbUrl, dbName, socket) => {
  await initAppStateChangesWatcher(db, dbUrl, dbName, socket);
  await initModeChangesWatcher(db, dbUrl, dbName, socket);
}
