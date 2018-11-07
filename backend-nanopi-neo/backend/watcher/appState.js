
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
  rescanAudioFolders,
} from './utils';

import sleepTimer from './sleepTimer';
import mediaController from '../controller/mediaController';
import serialController from '../controller/serialController';

async function getPower(db, dbName) {
  const state = await getState(db, dbName);
  return state[constants.dbStatusPower];
}

async function startAirPlay(isStart) {
  return execa.shellSync(isStart ? config.airPlayStartCommand : config.airPlayStopCommand);
}

async function playSelection(socket, serialPort, mqttClient, db, dbName, mode) {
  const state = await getState(db, dbName);
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
      dbName,
      serialController,
      mediaController,
      socket,
      serialPort,
      mqttClient,
      mode,
      selectedId,
    );
  }
}

export async function doPower(
  serialContr,
  mediaContr,
  socket,
  serialPort,
  mqttClient,
  enabled,
  db,
  dbName,
) {
  sendLog('doPower()', enabled);
  if (enabled) {
    const mode = await getMode(db, dbName);
    playSelection(socket, serialPort, mqttClient, db, dbName, mode);
  } else {
    mediaContr.stop(socket);
  }
  serialContr.sendPower(serialPort, enabled);
}

/* eslint-disable func-names, prefer-arrow-callback */
export async function initAppStateChangesWatcher(
  db,
  dbUrl,
  dbName,
  socket,
  serialPort,
  mqttClient,
) {
  let state = await getState(db, dbName);

  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAppState, async function (result) {
    const newState = result.doc[constants.dbFieldState];

    const mode = checkDbFieldChanges(constants.dbStatusMode, state, newState);
    if (mode !== null) {
      serialController.sendMode(serialPort, mode);
      const power = await getPower(db, dbName);
      mediaController.stop(socket);
      if (power) {
        playSelection(socket, serialPort, mqttClient, db, dbName, mode);
      }
      state = newState;
    }

    const power = checkDbFieldChanges(constants.dbStatusPower, state, newState);
    if (power !== null) {
      if (!power) {
        sleepTimer.set(db, serialPort, false);
      }
      doPower(serialController, mediaController, socket, serialPort, mqttClient, power, db, dbName);
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
      playSelectedItem(
        db,
        dbName,
        serialController,
        mediaController,
        socket,
        serialPort,
        mqttClient,
        constants.modeFmRadio,
        fmItem,
      );
      state = newState;
    }

    const sleepTimerTime = checkDbFieldChanges(constants.dbStatusSleepTimer, state, newState);
    if (sleepTimerTime !== null) {
      serialController.sendSleepTimer(serialPort, [sleepTimerTime,
        state[constants.dbStatusSleepTimerOn]]);
      state = newState;
    }

    const webItem = checkDbFieldChanges(constants.dbStatusSelectedWebRadioId, state, newState);
    if (webItem !== null) {
      playSelectedItem(
        db,
        dbName,
        serialController,
        mediaController,
        socket,
        serialPort,
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
        dbName,
        serialController,
        mediaController,
        socket,
        serialPort,
        mqttClient,
        constants.modeAudioPlayer,
        [playlist, 1],
      );
      state = newState;
    }

    const track = checkDbFieldChanges(constants.dbStatusSelectedAudioTrackId, state, newState);
    if (track !== null) {
      await serialController.sendAudioPlayerItem(serialPort, track);
      await mediaController.playAudioTrackItem(track, socket, serialPort, mqttClient, false);
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
        dbName,
        mediaController,
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
      rescanAudioFolders(
        db,
        mediaController,
      );
      state = newState;
    }

    const sleepTimerOn = checkDbFieldChanges(constants.dbStatusSleepTimerOn, state, newState);
    if (sleepTimerOn !== null) {
      sendLog('sleepTimerOn()', `${constants.dbStatusSleepTimerOn} ${sleepTimerOn}`);
      sleepTimer.start(
        sleepTimerOn, newState[constants.dbStatusSleepTimer],
        socket, serialPort, db,
      );
      serialController.sendSleepTimer(
        serialPort,
        [state[constants.dbStatusSleepTimer], sleepTimerOn],
      );
      state = newState;
    }

    const audioPlayerShuffle = checkDbFieldChanges(constants.dbStatusAudioPlayerShuffle, state, newState);
    if (audioPlayerShuffle !== null) {
      sendLog('audioPlayerShuffle', `${constants.dbStatusAudioPlayerShuffle} ${audioPlayerShuffle}`);
      mediaController.setAudioPlayerShuttle(audioPlayerShuffle);
      state = newState;
    }

    const audioPlayerPlay = checkDbFieldChanges(constants.dbStatusAudioPlayerPlay, state, newState);
    if (audioPlayerPlay !== null) {
      sendLog('audioPlayerPlay', `${constants.dbStatusAudioPlayerPlay} ${audioPlayerPlay}`);
      mediaController.setAudioPlayerPlay(audioPlayerPlay);
      state = newState;
    }

    const fmSeek = checkDbFieldChanges(constants.dbStatusFmSeek, state, newState);
    if (fmSeek !== null) {
      sendLog('dbStatusFmSeek', `${constants.dbStatusFmSeek} ${fmSeek}`);
      serialController.sendFmSeek(serialPort, fmSeek);
      state = newState;
    }
  });
}

export default async function (db, dbUrl, dbName, socket, serialPort, mqttClient) {
  await initAppStateChangesWatcher(db, dbUrl, dbName, socket, serialPort, mqttClient);
}
