import { load } from 'crontab';

import config from '../config';
import constants from '../constants';
import { dbDocumentWatcher, sendLog } from './utils';
import serialController from '../controller/serialController';

const ALARM1 = 1;
const ALARM2 = 2;

const updateAlarms = (serialPort, data) => {
  sendLog('updateAlarms');
  load((err, crontab) => {
    for (const item of data) {
      const onComment = `alarm ${item.id} on`;
      const offComment = `alarm ${item.id} off`;
      crontab.remove({ comment: onComment });
      crontab.remove({ comment: offComment });
      if (item.enabled) {
        const onCommand = `${config.alarmOnScriptPath} ${item.volume} ${item.presetType} ${item.preset}`;
        const weekDays = item.days.join(',');
        const time = `${item.min} ${item.hour} * * ${weekDays}`;
        sendLog('updateAlarms()', `${time} ${onCommand} ${onComment}`);
        crontab.create(onCommand, time, onComment);

        const onDate = new Date(1970, 0, 1, parseInt(item.hour, 10), parseInt(item.min, 10));
        const offDate = new Date(onDate.getTime());
        offDate.setTime(onDate.getTime() + (item.timeout * 60 * 1000));
        const offTime = `${offDate.getMinutes()} ${offDate.getHours()} * * ${weekDays}`;
        const offCommand = config.alarmOffScriptPath;
        sendLog('updateAlarms()', `${offTime} ${offCommand} ${offComment}`);
        crontab.create(offCommand, offTime, offComment);
      }
      const serialValue = [
        item.hour,
        item.min,
        item.enabled,
      ];
      if (item.id === ALARM1) {
        serialController.sendAlarm1(serialPort, serialValue);
      } else if (item.id === ALARM2) {
        serialController.sendAlarm2(serialPort, serialValue);
      }
    }
    crontab.save((error) => {
      if (error) {
        sendLog('updateAlarms()', err);
      }
    });
  });
};

export default async (dbUrl, dbName, serialPort) => {
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAlarm, (result) => {
    const newState = result.doc[constants.dbFieldState];
    updateAlarms(serialPort, newState);
  });
};
