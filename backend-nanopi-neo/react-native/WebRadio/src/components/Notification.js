import {
  Platform,
  AsyncStorage,
} from 'react-native';
import io from 'socket.io-client';
import PushNotification from 'react-native-push-notification';
import i18n from 'i18next';

import {
  MEDIA_NOTIFICATION_ID,
  SERVER_HOST,
  DEFAULT_SERVER_HOST,
  NOTIFICATION_MEDIA_INFO,
  NOTIFICATION_SLEEP_TIMER,
  SLEEP_TIMER_NOTIFICATION_ID,
} from '../constants/Common';

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
    const title = (data.title) ? `${data.artist} - ${data.title}` : data.artist;
    const format = formatMediaData(data.format);
    let message = `${formatTime(data.elapsedTime, data.totalTime)} ${data.bitrate}kB/s ${format}`;
    if (Platform.OS === 'ios') {
      message = title;
    }
    PushNotification.localNotification({
      id: MEDIA_NOTIFICATION_ID,
      title,
      message,
      playSound: false,
    });
  } else if (data.state === 'stop') {
    PushNotification.cancelAllLocalNotifications();
  }
};

const showSleepTimerNotification = (data) => {
  if (data.remaining > 0) {
    const title = i18n.t('notification.sleepTimerTitle');
    let message = i18n.t('notification.sleepTimerRemainingTime', { time: data.remaining });
    if (Platform.OS === 'ios') {
      message = title;
    }
    PushNotification.localNotification({
      id: SLEEP_TIMER_NOTIFICATION_ID,
      title,
      message,
      playSound: false,
    });
  } else {
    PushNotification.cancelAllLocalNotifications();
  }
};

export default async function () {
  const server = await getServer();
  const socket = io(`${server}:3000`, { transports: ['websocket'] });
  socket.on(NOTIFICATION_MEDIA_INFO, (data) => {
    showMediaInfoNotification(data);
  });
  socket.on(NOTIFICATION_SLEEP_TIMER, (data) => {
    showSleepTimerNotification(data);
  });
}
