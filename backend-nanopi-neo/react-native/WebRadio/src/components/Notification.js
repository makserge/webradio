import {
  Platform,
  AsyncStorage
} from 'react-native';
import io from 'socket.io-client';
import PushNotification from 'react-native-push-notification';
import {
  MEDIA_NOTIFICATION_ID,
  SERVER_HOST,
  DEFAULT_SERVER_HOST
} from '../constants/Common';

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

const getServer = async() =>
  new Promise((resolve) => {
    AsyncStorage.getItem(SERVER_HOST).then((value) => {
      if (value) {
        resolve(value);
      } else {
        resolve(DEFAULT_SERVER_HOST);
      }
    });
  });

export default async() => {
  const server = await getServer();
  const socket = io(`${server}:3000`, { transports: ['websocket'] });
  socket.on('mediaMetaInfo', (data) => {
      if (data.state === 'play') {
        const title = `${data.artist} - ${data.title}`;
        let message = `${formatTime(data.elapsedTime, data.totalTime)} ${data.bitrate}kB/s ${formatMediaData(data.format)}`;
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
    });
};
