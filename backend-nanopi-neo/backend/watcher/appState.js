
import execa from 'execa';

import config from '../config';
import constants from '../constants';
import {
  dbDocumentWatcher,
  checkDbFieldChanges,
  playSelectedItem,
  getMode,
  getState,
  sendLog,
  scanFolder,
  setAppStateField,
} from './utils';

import sleepTimer from './sleepTimer';
import {
  stop,
  playAudioTrackItem,
  setAudioPlayerPlay,
  setAudioPlayerShuttle,
  rescanAudioFolders,
} from '../controller/mediaController';

async function getPower(db) {
  const state = await getState(db);
  return state[constants.dbStatusPower];
}

async function startAirPlay(isStart) {
  return execa.shellSync(isStart ? config.airPlayStartCommand : config.airPlayStopCommand);
}

async function playSelection(socket, serialController, mqttClient, db, mode) {
  const state = await getState(db);
  let selectedId;

  switch (mode) {
    case constants.modeFmRadio:
      selectedId = state[constants.dbStatusSelectedFmRadioId];
      break;
    case constants.modeAudioPlayer:
      selectedId = [state[constants.dbStatusSelectedAudioPlayListId],
        state[constants.dbStatusSelectedAudioTrackId]];
      break;
    default:
      selectedId = state[constants.dbStatusSelectedWebRadioId];
      break;
  }
  await startAirPlay(mode === constants.modeAirPlay);
  if (selectedId) {
    playSelectedItem(
      db,
      serialController,
      socket,
      mqttClient,
      mode,
      selectedId,
    );
  }
}

export async function doPower(
  serialController,
  socket,
  mqttClient,
  enabled,
  db,
) {
  sendLog('doPower()', enabled);
  if (enabled) {
    const mode = await getMode(db);
    playSelection(socket, serialController, mqttClient, db, mode);
  } else {
    stop(socket);
  }
  serialController.sendPower(enabled);
}

export async function initAppStateChangesWatcher(
  db,
  dbUrl,
  dbName,
  socket,
  serialController,
  mqttClient,
) {
  let state = await getState(db);

  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAppState, async (result) => {
    const newState = result.doc[constants.dbFieldState];

    const mode = checkDbFieldChanges(constants.dbStatusMode, state, newState);
    if (mode !== null) {
      serialController.sendMode(mode);
      const power = await getPower(db);
      stop(socket);
      if (power) {
        playSelection(socket, serialController, mqttClient, db, mode);
      }
      state = newState;
    }

    const power = checkDbFieldChanges(constants.dbStatusPower, state, newState);
    if (power !== null) {
      if (!power) {
        sleepTimer.set(db, serialController, false);
      }
      doPower(serialController, socket, mqttClient, power, db);
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
      playSelectedItem(
        db,
        serialController,
        socket,
        mqttClient,
        constants.modeFmRadio,
        fmItem,
      );
      state = newState;
    }

    const sleepTimerTime = checkDbFieldChanges(constants.dbStatusSleepTimer, state, newState);
    if (sleepTimerTime !== null) {
      serialController.sendSleepTimer([sleepTimerTime, state[constants.dbStatusSleepTimerOn]]);
      state = newState;
    }

    const webItem = checkDbFieldChanges(constants.dbStatusSelectedWebRadioId, state, newState);
    if (webItem !== null) {
      playSelectedItem(
        db,
        serialController,
        socket,
        mqttClient,
        constants.modeWebRadio,
        webItem,
      );
      state = newState;
    }

    const playlist = checkDbFieldChanges(
      constants.dbStatusSelectedAudioPlayListId,
      state,
      newState,
    );
    if (playlist !== null) {
      playSelectedItem(
        db,
        serialController,
        socket,
        mqttClient,
        constants.modeAudioPlayer,
        [playlist, 1],
      );
      state = newState;
    }

    const track = checkDbFieldChanges(constants.dbStatusSelectedAudioTrackId, state, newState);
    if (track !== null) {
      await serialController.sendAudioPlayerItem(track);
      await playAudioTrackItem(track, socket, mqttClient, false);
      state = newState;
    }

    const folder = checkDbFieldChanges(
      constants.dbStatusSelectedAudioFolder,
      state,
      newState,
    );
    if (folder !== null) {
      scanFolder(
        db,
        folder,
      );
      state = newState;
    }

    const rescanFolders = checkDbFieldChanges(
      constants.dbStatusRescanAudioFolders,
      state,
      newState,
    );
    if (rescanFolders) {
      await rescanAudioFolders();
      await setAppStateField(db, constants.dbStatusRescanAudioFolders, false);
      state = newState;
    }

    const sleepTimerOn = checkDbFieldChanges(constants.dbStatusSleepTimerOn, state, newState);
    if (sleepTimerOn !== null) {
      sendLog('sleepTimerOn()', `${constants.dbStatusSleepTimerOn} ${sleepTimerOn}`);
      sleepTimer.start(
        sleepTimerOn, newState[constants.dbStatusSleepTimer],
        socket, serialController, db,
      );
      serialController.sendSleepTimer([state[constants.dbStatusSleepTimer], sleepTimerOn]);
      state = newState;
    }

    const audioPlayerShuffle = checkDbFieldChanges(constants.dbStatusAudioPlayerShuffle, state,
      newState);
    if (audioPlayerShuffle !== null) {
      sendLog('audioPlayerShuffle', `${constants.dbStatusAudioPlayerShuffle} ${audioPlayerShuffle}`);
      setAudioPlayerShuttle(audioPlayerShuffle);
      state = newState;
    }

    const audioPlayerPlay = checkDbFieldChanges(constants.dbStatusAudioPlayerPlay, state, newState);
    if (audioPlayerPlay !== null) {
      sendLog('audioPlayerPlay', `${constants.dbStatusAudioPlayerPlay} ${audioPlayerPlay}`);
      setAudioPlayerPlay(audioPlayerPlay);
      state = newState;
    }

    const fmSeek = checkDbFieldChanges(constants.dbStatusFmSeek, state, newState);
    if (fmSeek !== null) {
      sendLog('dbStatusFmSeek', `${constants.dbStatusFmSeek} ${fmSeek}`);
      serialController.sendFmSeek(fmSeek);
      state = newState;
    }
  });
}

export default async (db, dbUrl, dbName, socket, serialController, mqttClient) => {
  await initAppStateChangesWatcher(db, dbUrl, dbName, socket, serialController, mqttClient);
};
