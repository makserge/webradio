'use strict';

module.exports = {
	debug: 1,
	port: 3000,
	sqlite: '/usr/bin/sqlite3',
	sqliteDb: './webradio.sqlite',
	mediaDir: '/root/nodejs/server/images',
	imageDir: './images',
	contentDir: '/var/lib/mpd/music/Music',
	contentDirMpd: '/var/lib/mpd/music',
	serialPort: '/dev/ttyS0',
	serialPortBaudRate: 9600,
	serialPortDelimiter: '\r\n',
	scriptPath: '/root/server/scripts/',
	networkType: 1,
	fmType: 2,
	playerType: 3,
	couchDbName: 'webradio',
	couchDbUrl: 'http://localhost:5984',
	mpdPort: 6600,
	mpdHost: 'localhost',
	alarmOnScriptPath: '/home/webradio/backend/console/alarm.js 1',
	alarmOffScriptPath: '/home/webradio/backend/console/alarm.js 0',
	socketHeartBeatTimeout: 4000,
	socketHeartBeatInterval: 2000
};
