import {
  NativeModules,
  Platform,
  AsyncStorage,
  DeviceEventEmitter,
} from 'react-native';
import io from 'socket.io-client';
import i18n from 'i18next';

import {
  MEDIA_NOTIFICATION_ID,
  SERVER_HOST,
  DEFAULT_SERVER_HOST,
  NOTIFICATION_MEDIA_INFO,
  NOTIFICATION_SLEEP_TIMER,
  SLEEP_TIMER_NOTIFICATION_ID,
  MEDIA_ACTION_SHUFFLE,
  MEDIA_ACTION_PREVIOUS,
  MEDIA_ACTION_PLAY,
  MEDIA_ACTION_NEXT,
} from '../constants/Common';

import {
  toggleAudioPlayerShuffle,
  playPreviousItem,
  toggleAudioPlayerPlay,
  playNextItem,
} from '../actions/AudioTrack';

const RNNotifications = NativeModules.WixRNNotifications;

/* eslint-disable import/no-named-as-default-member */
const formatTime = (elapsedTime, totalTime) => {
  if (totalTime === '00:00') {
    return elapsedTime;
  }
  return `${elapsedTime}/${totalTime}`;
};

const formatMediaData = (data) => {
  if (!data) {
    return '';
  }
  const dataArray = data.split(':');
  if (dataArray[2] === '2') dataArray[2] = 'Stereo';
  else if (dataArray[2] === '1') dataArray[2] = 'Mono';
  return `${dataArray[0]}Hz ${dataArray[1]}bit ${dataArray[2]}`;
};

async function getServer() {
  return new Promise((resolve) => {
    AsyncStorage.getItem(SERVER_HOST).then((value) => {
      if (value) {
        resolve(value);
      } else {
        resolve(DEFAULT_SERVER_HOST);
      }
    });
  });
}

const showMediaInfoNotification = (data) => {
  if (data.state === 'play' && (data.artist || data.title)) {
    const format = formatMediaData(data.format);
    let body = `${formatTime(data.elapsedTime, data.totalTime)} ${data.bitrate}kB/s ${format}`;
    if (Platform.OS === 'ios') {
      body = (data.title) ? `${data.artist} - ${data.title}` : data.artist;
    }
    RNNotifications.postLocalNotification(
      {
        artist: data.artist,
        title: data.title,
        body,
        isShuffle: data.isShuffle,
        isPlay: data.isPlay,
        isAudioPlayer: data.isAudioPlayer,
        isFirstTrack: data.isFirstTrack,
        isLastTrack: data.isLastTrack,
        isMediaNotification: true,
      },
      MEDIA_NOTIFICATION_ID,
    );
  } else if (data.state === 'stop') {
    RNNotifications.cancelLocalNotification(MEDIA_NOTIFICATION_ID);
  }
};

const showSleepTimerNotification = (data) => {
  if (data.remaining > 0) {
    const title = i18n.t('notification.sleepTimerTitle');
    let body = i18n.t('notification.sleepTimerRemainingTime', { time: data.remaining });
    if (Platform.OS === 'ios') {
      body = title;
    }
    RNNotifications.postLocalNotification(
      {
        title,
        body,
        isMediaNotification: false,
      },
      SLEEP_TIMER_NOTIFICATION_ID,
    );
  } else {
    RNNotifications.cancelLocalNotification(SLEEP_TIMER_NOTIFICATION_ID);
  }
};

export default async function (store) {
  const server = await getServer();
  const socket = io(`${server}:3000`, { transports: ['websocket'] });
  socket.on(NOTIFICATION_MEDIA_INFO, (data) => {
    showMediaInfoNotification(data);
  });
  socket.on(NOTIFICATION_SLEEP_TIMER, (data) => {
    showSleepTimerNotification(data);
  });

  DeviceEventEmitter.addListener('MediaControlsAction', (action) => {
    switch (action.action) {
      case MEDIA_ACTION_SHUFFLE:
        store.dispatch(toggleAudioPlayerShuffle());
        break;
      case MEDIA_ACTION_PREVIOUS:
        store.dispatch(playPreviousItem());
        break;
      case MEDIA_ACTION_PLAY:
        store.dispatch(toggleAudioPlayerPlay());
        break;
      case MEDIA_ACTION_NEXT:
        store.dispatch(playNextItem());
        break;
      default:
    }
  });
}
