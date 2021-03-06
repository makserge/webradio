import {
  NativeModules,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import i18n from 'i18next';

import {
  MEDIA_NOTIFICATION_ID,
  SERVER_HOST,
  DEFAULT_SERVER_HOST,
  NOTIFICATION_MEDIA_INFO,
  NOTIFICATION_SLEEP_TIMER,
  NOTIFICATION_RDS_PS,
  NOTIFICATION_RDS_RT,
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

const { Notifications } = NativeModules;

const formatTracks = (track, totalTracks) => {
  if (totalTracks === undefined) {
    return track;
  }
  return `${track}/${totalTracks}`;
};

const formatTime = (elapsedTime, totalTime) => {
  if (elapsedTime === undefined) {
    return totalTime;
  }
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
  return `${dataArray[0] / 1000}kHz ${dataArray[1]}bit ${dataArray[2]}`;
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
  if (data.state === 'stop') {
    Notifications.cancelLocalNotification(MEDIA_NOTIFICATION_ID);
  } else if (data.artist || data.title) {
    const tracks = formatTracks(data.track, data.totalTracks);
    const bitrate = (data.bitrate !== undefined) ? `${data.bitrate}kB/s ` : '';
    const format = formatMediaData(data.format);
    let body = `#${tracks} ${formatTime(data.elapsedTime, data.totalTime)} ${bitrate}${format}`;
    if (Platform.OS === 'ios') {
      body = (data.title) ? `${data.artist} - ${data.title}` : data.artist;
    }
    if (data.totalTracks === undefined) { // Airplay notification
      Notifications.postLocalNotification(
        {
          title: `${data.title} - ${data.artist}`,
          body,
          isMediaNotification: false,
        },
        MEDIA_NOTIFICATION_ID,
      );
    } else {
      const track = parseInt(data.track, 10);
      const totalTracks = parseInt(data.totalTracks, 10);
      Notifications.postLocalNotification(
        {
          artist: data.artist,
          title: data.title,
          body,
          isShuffle: data.random === '1',
          isPlay: data.state === 'play',
          isAudioPlayer: data.isAudioPlayer === '1',
          isFirstTrack: track === 1,
          isLastTrack: track === totalTracks,
          isMediaNotification: true,
        },
        MEDIA_NOTIFICATION_ID,
      );
    }
  }
};

const showSleepTimerNotification = (data) => {
  if (data.remaining > 0) {
    const title = i18n.t('notification.sleepTimerTitle');
    let body = i18n.t('notification.sleepTimerRemainingTime', { time: data.remaining });
    if (Platform.OS === 'ios') {
      body = title;
    }
    Notifications.postLocalNotification(
      {
        title,
        body,
        isMediaNotification: false,
      },
      SLEEP_TIMER_NOTIFICATION_ID,
    );
  } else {
    Notifications.cancelLocalNotification(SLEEP_TIMER_NOTIFICATION_ID);
  }
};

const showRadioNotification = (data) => {
  if (data) {
    const title = i18n.t('notification.radioNotificationTitle');
    Notifications.postLocalNotification(
      {
        title,
        body: data,
        isMediaNotification: false,
      },
      MEDIA_NOTIFICATION_ID,
    );
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
  socket.on(NOTIFICATION_RDS_PS, (data) => {
    showRadioNotification(data);
  });
  socket.on(NOTIFICATION_RDS_RT, (data) => {
    showRadioNotification(data);
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
