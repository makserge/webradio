'use strict';

module.exports = {
	debug: 1,
	port: 3000,
	sqlite: '/usr/bin/sqlite3',
	sqliteDb: './webradio.sqlite',
	mediaDir: '/root/nodejs/server/images',
	imageDir: './images',
	contentDir: '/mnt/dietpi_userdata',
	serialPort: '/dev/ttyS1',
	serialPortBaudRate: 9600,
	serialPortDelimiter: '\r\n',
	scriptPath: '/root/server/scripts/',
	networkType: 1,
	fmType: 2,
	playerType: 3,
	couchDbName: 'webradio',
	couchDbUrl: 'http://localhost:5984',
	mpdPort: 6600,
	mpdHost: 'localhost'
};
