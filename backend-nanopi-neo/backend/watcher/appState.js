import execa from 'execa';

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
  startScanDabPresets,
  stopScanDabPresets,
} from './utils';

import sleepTimer from './sleepTimer';
import {
  stop,
  playAudioTrackItem,
  setAudioPlayerPlay,
  setAudioPlayerShuttle,
  rescanAudioFolders,
  stopDabRadio,
} from '../controller/mediaController';

async function getPower(db) {
  const state = await getState(db);
  return state[constants.dbStatusPower];
}

async function startAirPlay(isStart) {
  return execa.shellSync(isStart ? constants.airPlayStartCommand : constants.airPlayStopCommand);
}

async function playSelection(socket, serialController, mqttClient, db, mode) {
  const state = await getState(db);
  let selectedId;

  switch (mode) {
    case constants.modeFmRadio:
      selectedId = state[constants.dbStatusSelectedFmRadioId];
      break;
    case constants.modeDabRadio:
      selectedId = state[constants.dbStatusSelectedDabRadioId];
      break;
    case constants.modeAudioPlayer:
      selectedId = [state[constants.dbStatusSelectedAudioPlayListId],
        state[constants.dbStatusSelectedAudioTrackId]];
      break;
    default:
      selectedId = state[constants.dbStatusSelectedWebRadioId];
      break;
  }
  await startAirPlay(mode === constants.modeAirPlay, socket, mqttClient);
  await stopDabRadio();
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
    await stop(socket);
    await stopDabRadio();
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

    const modeWatcher = async () => {
      const mode = checkDbFieldChanges(constants.dbStatusMode, state, newState);
      if (mode !== null) {
        serialController.sendMode(mode);
        const power = await getPower(db);
        await stop(socket);
        if (power) {
          playSelection(socket, serialController, mqttClient, db, mode);
        }
        state = newState;
      }
    };

    const powerWatcher = () => {
      const power = checkDbFieldChanges(constants.dbStatusPower, state, newState);
      if (power !== null) {
        if (!power) {
          sleepTimer.set(db, serialController, false);
        }
        doPower(serialController, socket, mqttClient, power, db);
        state = newState;
      }
    };

    const volumeWatcher = () => {
      const volume = checkDbFieldChanges(constants.dbStatusVolume, state, newState);
      if (volume !== null) {
        serialController.sendVolume(volume);
        state = newState;
      }
    };

    const volumeMuteWatcher = () => {
      const volumeMute = checkDbFieldChanges(constants.dbStatusVolumeMute, state, newState);
      if (volumeMute !== null) {
        serialController.sendVolumeMute(volumeMute);
        state = newState;
      }
    };

    const playFmWatcher = () => {
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
    };

    const playDabWatcher = async () => {
      const dabItem = checkDbFieldChanges(constants.dbStatusSelectedDabRadioId, state, newState);
      if (dabItem !== null) {
        await stopDabRadio();
        playSelectedItem(
          db,
          serialController,
          socket,
          mqttClient,
          constants.modeDabRadio,
          dabItem,
        );
        state = newState;
      }
    };

    const sleepTimerWatcher = () => {
      const sleepTimerTime = checkDbFieldChanges(constants.dbStatusSleepTimer, state, newState);
      if (sleepTimerTime !== null) {
        serialController.sendSleepTimer([sleepTimerTime, state[constants.dbStatusSleepTimerOn]]);
        state = newState;
      }
    };

    const sleepTimerOnWatcher = () => {
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
    };

    const playWebWatcher = () => {
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
    };

    const selectAudioPlaylistWatcher = () => {
      const playlist = checkDbFieldChanges(constants.dbStatusSelectedAudioPlayListId, state,
        newState);
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
    };

    const playAudioTrackWatcher = async () => {
      const track = checkDbFieldChanges(constants.dbStatusSelectedAudioTrackId, state, newState);
      if (track !== null) {
        await serialController.sendAudioPlayerItem(track);
        await playAudioTrackItem(track, socket, serialController, mqttClient, false);
        state = newState;
      }
    };

    const selectAudioFolderWatcher = () => {
      const folder = checkDbFieldChanges(constants.dbStatusSelectedAudioFolder, state, newState);
      if (folder !== null) {
        scanFolder(
          db,
          folder,
        );
        state = newState;
      }
    };

    const rescanAudioFolderWatcher = async () => {
      const rescanFolders = checkDbFieldChanges(constants.dbStatusRescanAudioFolders, state,
        newState);
      if (rescanFolders) {
        await rescanAudioFolders();
        await setAppStateField(db, constants.dbStatusRescanAudioFolders, false);
        state = newState;
      }
    };

    const shuffleAudioWatcher = () => {
      const audioPlayerShuffle = checkDbFieldChanges(constants.dbStatusAudioPlayerShuffle, state,
        newState);
      if (audioPlayerShuffle !== null) {
        sendLog('audioPlayerShuffle', `${constants.dbStatusAudioPlayerShuffle} ${audioPlayerShuffle}`);
        setAudioPlayerShuttle(audioPlayerShuffle);
        state = newState;
      }
    };

    const playAudioPlayerWatcher = () => {
      const audioPlayerPlay = checkDbFieldChanges(constants.dbStatusAudioPlayerPlay, state,
        newState);
      if (audioPlayerPlay !== null) {
        sendLog('audioPlayerPlay', `${constants.dbStatusAudioPlayerPlay} ${audioPlayerPlay}`);
        setAudioPlayerPlay(audioPlayerPlay);
        state = newState;
      }
    };

    const fmSeekUpWatcher = () => {
      const fmSeekUp = checkDbFieldChanges(constants.dbStatusFmSeekUp, state, newState);
      if (fmSeekUp !== null) {
        sendLog('dbStatusFmSeekUp', `${constants.dbStatusFmSeekUp} ${fmSeekUp}`);
        if (fmSeekUp) {
          serialController.sendFmSeek([1, newState[constants.dbStatusSeekFmRadioFrequency] * 10]);
        } else {
          serialController.sendFmSeekStop(1);
        }
        state = newState;
      }
    };

    const fmSeekDownWatcher = () => {
      const fmSeekDown = checkDbFieldChanges(constants.dbStatusFmSeekDown, state, newState);
      if (fmSeekDown !== null) {
        sendLog('dbStatusFmSeekDown', `${constants.dbStatusFmSeekDown} ${fmSeekDown}`);
        if (fmSeekDown) {
          serialController.sendFmSeek([0, newState[constants.dbStatusSeekFmRadioFrequency] * 10]);
        } else {
          serialController.sendFmSeekStop(1);
        }
        state = newState;
      }
    };

    const rescanDabWatcher = () => {
      const rescanDabPresets = checkDbFieldChanges(constants.dbStatusRescanDabPresets, state,
        newState);
      if (rescanDabPresets !== null) {
        sendLog('rescanDabPresets', `${constants.dbStatusRescanDabPresets} ${rescanDabPresets}`);
        if (rescanDabPresets) {
          startScanDabPresets(db);
        } else {
          stopScanDabPresets();
        }
        state = newState;
      }
    };

    await modeWatcher();
    powerWatcher();
    volumeWatcher();
    volumeMuteWatcher();
    playFmWatcher();
    await playDabWatcher();
    sleepTimerWatcher();
    sleepTimerOnWatcher();
    playWebWatcher();
    selectAudioPlaylistWatcher();
    await playAudioTrackWatcher();
    selectAudioFolderWatcher();
    await rescanAudioFolderWatcher();
    shuffleAudioWatcher();
    playAudioPlayerWatcher();
    fmSeekUpWatcher();
    fmSeekDownWatcher();
    rescanDabWatcher();
  });
}

export default async (db, dbUrl, dbName, socket, serialController, mqttClient) => {
  await initAppStateChangesWatcher(db, dbUrl, dbName, socket, serialController, mqttClient);
};
