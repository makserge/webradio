import { load } from 'crontab';

import config from '../config';
import constants from '../constants';
import { dbDocumentWatcher } from './utils';
import serialController from '../controller/serialController';

const ALARM1 = 1;
const ALARM2 = 2;

const updateAlarms = (serialPort, data) => {
  console.log('updateAlarms');
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
        console.log (time, ' ', onCommand, ' ', onComment);
        crontab.create(onCommand, time, onComment);

        const onDate = new Date(1970, 0, 1, parseInt(item.hour), parseInt(item.min));
        const offDate = new Date(onDate.getTime());
        offDate.setTime(onDate.getTime() + item.timeout * 60 * 1000);
        const offTime = `${offDate.getMinutes()} ${offDate.getHours()} * * ${weekDays}`;
        const offCommand = config.alarmOffScriptPath;
        console.log(offTime, ' ', offCommand, ' ', offComment);
        crontab.create(offCommand, offTime, offComment);
      }
      const serialValue = [
        item.presetType,
        item.preset,
        item.volume,
        item.timeout,
        item.hour,
        item.min,
        item.enabled
      ];
      if (item.id === ALARM1) {
        serialController.sendAlarm1(serialPort, serialValue);
      } else if (item.id === ALARM2) {
        serialController.sendAlarm2(serialPort, serialValue);
      }
    }
    crontab.save(function(err, crontab) {
      if (err) {
        console.log(err)
      }
    });
  });
}

export default async(dbUrl, dbName, serialPort) => {
  dbDocumentWatcher(dbUrl, dbName, constants.dbDocumentAlarm, (result) => {
    const newState = result.doc[constants.dbFieldState];
    updateAlarms(serialPort, newState);
	});
}
