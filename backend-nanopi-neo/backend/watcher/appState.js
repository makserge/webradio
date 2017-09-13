import constants from '../constants';
import {
  dbDocumentWatcher,
  checkDbFieldChanges,
  getObjectDiff,
  playSelectedItem,
  getMode,
  getState
} from './utils';

import sleepTimer from './sleepTimer';
import mediaController from '../controller/mediaController';
import serialController from '../controller/serialController';

const getPower = async(db, dbName) => {
  let state = await getState(db, dbName);
  return state[constants.dbStatusPower];
}

export const doPower = async(serialController, mediaController, socket, enabled, db, dbName) => {
  console.log('doPower', enabled);
  if (enabled) {
    const mode = await getMode(db, dbName);
    playSelection(socket, db, dbName, mode);
  }
  else {
    mediaController.stop();
  }
  serialController.sendPower(enabled);
}

const playSelection = async(socket, db, dbName, mode) => {
  const state = await getState(db, dbName);
  let selectedId;

  if (mode === constants.modeWebRadio) {
    selectedId = state[constants.dbStatusSelectedWebRadioId];
  }
  else if (mode === constants.modeFmRadio) {
    selectedId = state[constants.dbStatusSelectedFmRadioId];
  }
  else if (mode === constants.modeAudioPlayer) {
    selectedId = [ state[constants.dbStatusSelectedAudioPlayListId], state[constants.dbStatusSelectedAudioTrackId] ];
  }
  if (selectedId) {
    playSelectedItem(serialController, mediaController, socket, mode, selectedId);
  }
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
      doPower(serialController, mediaController, socket, power, db, dbName);
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
      playSelectedItem(serialController, mediaController, socket, constants.modeFmRadio, fmItem);
      state = newState;
    }

    const sleepTimerTime = checkDbFieldChanges(constants.dbStatusSleepTimer, state, newState);
    if (sleepTimerTime !== null) {
      serialController.sendSleepTimerTime(sleepTimerTime);
      state = newState;
    }

		const webItem = checkDbFieldChanges(constants.dbStatusSelectedWebRadioId, state, newState);
    if (webItem !== null) {
      playSelectedItem(serialController, mediaController, socket, constants.modeWebRadio, webItem);
			state = newState;
		}

		const playlist = checkDbFieldChanges(constants.dbStatusSelectedAudioPlayListId, state, newState);
    if (playlist !== null) {
      playSelectedItem(serialController, mediaController, socket, constants.modeAudioPlayer, [ playlist, 1 ]);
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
    if (newMode != constants.modeSettings && newMode != mode) {
			mode = newMode;
			console.log('mode', mode);
      serialController.sendMode(mode);
      const power = await getPower(db, dbName);
			mediaController.stop();
  		if (power) {
			   playSelection(socket, db, dbName, mode);
      }
		}
  });
}

export default async(db, dbUrl, dbName, socket) => {
  await initAppStateChangesWatcher(db, dbUrl, dbName, socket);
  await initModeChangesWatcher(db, dbUrl, dbName, socket);
}
