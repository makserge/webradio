
import execa from 'execa';

import config from '../config';
import constants from '../constants';
import {
  dbDocumentWatcher,
  checkDbFieldChanges,
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

export const doPower = async(serialController, mediaController, socket, serialPort, enabled, db, dbName) => {
  console.log('doPower', enabled);
  if (enabled) {
    const mode = await getMode(db, dbName);
    playSelection(socket, serialPort, db, dbName, mode);
  }
  else {
    mediaController.stop(socket);
  }
  serialController.sendPower(serialPort, enabled);
}

const playSelection = async(socket, serialPort, db, dbName, mode) => {
  const state = await getState(db, dbName);
  let selectedId;

  switch (mode) {
    case constants.modeWebRadio:
      selectedId = state[constants.dbStatusSelectedWebRadioId];
      break;
    case constants.modeFmRadio:
      selectedId = state[constants.dbStatusSelectedFmRadioId];
      break;
    case constants.modeAudioPlayer:
      selectedId = [ state[constants.dbStatusSelectedAudioPlayListId], state[constants.dbStatusSelectedAudioTrackId] ];
      break;
  }
  await startAirPlay(mode === constants.modeAirPlay);
  if (selectedId) {
    playSelectedItem(db, dbName, serialController, mediaController, socket, serialPort, mode, selectedId);
  }
}

const startAirPlay = async(isStart) => {
  return execa.shellSync(isStart ? config.airPlayStartCommand : config.airPlayStopCommand);
}

export const initAppStateChangesWatcher = async(db, dbUrl, dbName, socket, serialPort) => {
	let state = await getState(db, dbName);

  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAppState, async(result) => {
	  const newState = result.doc[constants.dbFieldState];

	  const power = checkDbFieldChanges(constants.dbStatusPower, state, newState);
    if (power !== null) {
	    if (!power) {
        sleepTimer.set(db, serialPort, false);
      }
      doPower(serialController, mediaController, socket, serialPort, power, db, dbName);
			state = newState;
		}

    const volume = checkDbFieldChanges(constants.dbStatusVolume, state, newState);
    if (volume !== null) {
	    serialController.sendVolume(serialPort, volume);
			state = newState;
		}

    const volumeMute = checkDbFieldChanges(constants.dbStatusVolumeMute, state, newState);
    if (volumeMute !== null) {
      serialController.sendVolumeMute(serialPort, volumeMute);
      state = newState;
    }

    const fmItem = checkDbFieldChanges(constants.dbStatusSelectedFmRadioId, state, newState);
    if (fmItem !== null) {
      playSelectedItem(db, dbName, serialController, mediaController, socket, serialPort, constants.modeFmRadio, fmItem);
      state = newState;
    }

    const sleepTimerTime = checkDbFieldChanges(constants.dbStatusSleepTimer, state, newState);
    if (sleepTimerTime !== null) {
      serialController.sendSleepTimer(serialPort, [sleepTimerTime, state[constants.dbStatusSleepTimerOn]]);
      state = newState;
    }

		const webItem = checkDbFieldChanges(constants.dbStatusSelectedWebRadioId, state, newState);
    if (webItem !== null) {
      playSelectedItem(db, dbName, serialController, mediaController, socket, serialPort, constants.modeWebRadio, webItem);
			state = newState;
		}

		const playlist = checkDbFieldChanges(constants.dbStatusSelectedAudioPlayListId, state, newState);
    if (playlist !== null) {
      playSelectedItem(db, dbName, serialController, mediaController, socket, serialPort, constants.modeAudioPlayer, [ playlist, 1 ]);
			state = newState;
		}

		const track = checkDbFieldChanges(constants.dbStatusSelectedAudioTrackId, state, newState);
    if (track !== null) {
       await serialController.sendAudioPlayerItem(serialPort, track);
    	await mediaController.playAudioTrackItem(track, socket, serialPort, false);
    	state = newState;
		}

    const sleepTimerOn = checkDbFieldChanges(constants.dbStatusSleepTimerOn, state, newState);
    if (sleepTimerOn !== null) {
	    console.log(constants.dbStatusSleepTimerOn, sleepTimerOn);
      sleepTimer.start(sleepTimerOn, newState[constants.dbStatusSleepTimer], socket, serialPort, db);
      serialController.sendSleepTimer(serialPort, [state[constants.dbStatusSleepTimer], sleepTimerOn]);
    	state = newState;
		}
  });
}

export const initModeChangesWatcher = async(db, dbUrl, dbName, socket, serialPort) => {
	let mode = await getMode(db, dbName);

  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentNavigation, async(result) => {
		const newMode = result.doc[constants.dbFieldState][constants.dbFieldRoutes][0][constants.dbFieldIndex];
    if (newMode != constants.modeSettings && newMode != mode) {
			mode = newMode;
			console.log('mode', mode);
      serialController.sendMode(serialPort, mode);
      const power = await getPower(db, dbName);
			mediaController.stop(socket);
  		if (power) {
			   playSelection(socket, serialPort, db, dbName, mode);
      }
		}
  });
}

export default async(db, dbUrl, dbName, socket, serialPort) => {
  await initAppStateChangesWatcher(db, dbUrl, dbName, socket, serialPort);
  await initModeChangesWatcher(db, dbUrl, dbName, socket, serialPort);
}
