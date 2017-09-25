'use strict';

module.exports = {
	debug: 1,
	port: 3000,
	contentDir: '/var/lib/mpd/music/Music',
	contentDirMpd: '/var/lib/mpd/music',
	serialPort: '/dev/ttyS0',
	serialPortBaudRate: 9600,
	serialPortDelimiter: '\r\n',
	couchDbName: 'webradio',
	couchDbUrl: 'http://localhost:5984',
	mpdPort: 6600,
	mpdHost: 'localhost',
	alarmOnScriptPath: '/home/webradio/backend/console/alarm.js 1',
	alarmOffScriptPath: '/home/webradio/backend/console/alarm.js 0',
	socketHeartBeatTimeout: 4000,
	socketHeartBeatInterval: 2000
};
