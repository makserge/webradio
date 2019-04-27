import dbClient from 'nano';
import minimist from 'minimist';

import config from '../config';

import { setMode, setAlarm, setPower } from '../watcher/utils';

export default async function (params) {
  const nano = dbClient(config.couchDbUrl);
  const db = nano.use(config.couchDbName);

  const argv = minimist(params);

  if (argv._[0]) {
    const volume = argv._[1];
    const mode = argv._[2];
    const selectedId = argv._[3];

    if (volume === undefined || mode === undefined || selectedId === undefined) {
      return;
    }
    await setMode(db, mode);
    await setAlarm(db, true, volume, mode, selectedId);
  } else {
    await setPower(db, false);
  }
}
