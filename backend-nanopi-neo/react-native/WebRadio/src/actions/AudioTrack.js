import {
  PLAY_AUDIO_TRACK,
  TOGGLE_AUDIO_PLAYER_SHUFFLE,
  TOGGLE_AUDIO_PLAYER_PLAY,
  PLAY_PREVIOUS_AUDIO_TRACK,
  PLAY_NEXT_AUDIO_TRACK,
} from '../constants/ActionTypes';

export const playItem = payload => ({
  type: PLAY_AUDIO_TRACK,
  payload,
});

export const toggleAudioPlayerShuffle = () => ({
  type: TOGGLE_AUDIO_PLAYER_SHUFFLE,
});

export const toggleAudioPlayerPlay = () => ({
  type: TOGGLE_AUDIO_PLAYER_PLAY,
});

export const playPreviousItem = () => ({
  type: PLAY_PREVIOUS_AUDIO_TRACK,
});

export const playNextItem = () => ({
  type: PLAY_NEXT_AUDIO_TRACK,
});
