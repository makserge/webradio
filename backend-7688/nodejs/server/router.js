'use strict';
var router = require('koa-router')();
var config = require('./config');
var dblite = require('dblite');
var fs = require('co-fs');
var path = require('path');
var exec = require('co-exec');

dblite.bin = config.sqlite;
var db = dblite('./webradio.sqlite');

router.get('/status', getStatus);
/*
router.get('/statusnetwork', getStatusNetwork);
router.get('/statusmp3', getStatusMp3);
router.get('/statuslinein', getStatusLineIn);
router.get('/statusairplay', getStatusAirplay);
router.get('/statussettings', getStatusSettings);
router.get('/curfmpreset', getCurFmPreset);
*/
router.get('/network', getNetworkItems);
/*
router.get('/curnetwork', getCurNetwork);
*/
router.get('/fm', getFmItems);
router.get('/mp3trackfolder', getMp3TrackFolder);
router.get('/mp3playlist', getMp3Playlists);
/*
router.get('/curmp3playlist', getCurMp3Playlist);
*/
router.get('/mp3track/:id', getMp3Tracks);
/*
router.get('/curmp3track', getCurMp3Track);
router.get('/volume', getVolume);
router.get('/mute', getMute);
router.get('/mode', getMode);
router.get('/sleep', getSleep);
router.get('/alarm1', getAlarm1);
router.get('/alarm2', getAlarm2);
*/
router.get('/netparams', getNetParams);
/*
router.post('/fm/update', setFm);
router.post('/fm/play', playFm);
router.post('/network/update', setNetwork);
router.post('/network/play', playNetwork);
router.post('/mp3playlist/update', setMp3Playlist);
router.post('/mp3playlist/play', playMp3Playlist);
router.post('/mp3playlist/index', indexMp3Playlist);
router.post('/mp3track/play', playMp3Track);
router.post('/volume/update', setVolume);
router.post('/mute/update', setMute);
router.post('/mode/update', setMode);
router.post('/clock/update', setClock);
router.post('/sleep/update', setSleep);
router.post('/alarm1/update', setAlarm1);
router.post('/alarm2/update', setAlarm2);
router.post('/power/update', setPower);
router.post('/netparams/update', setNetParams);
*/
/*
router.get('/todo/:id', show);
router.get('/todo/delete/:id', remove);
router.get('/todo/edit/:id', edit);
router.post('/todo/create', create);
router.post('/todo/update', update);
*/

function *dbKeyValueQuery(query) {
  return new Promise(function(resolve, reject) {
    db.query(query, ['key', 'value'],
		function (rows) {
			resolve(rows);
		}
	);
  });
}

function *dbListQuery(query) {
  return new Promise(function(resolve, reject) {
    db.query(query, ['id', 'title', 'value', 'order'], 
		function (rows) {
			resolve(rows);
		}	
	);
  });
}

function *dbTrackListQuery(query) {
  return new Promise(function(resolve, reject) {
    db.query(query, ['id', 'author', 'title', 'path', 'order'],
		function (rows) {
			resolve(rows);
		}
	);
  });
}

function *getFileStats(file) {
	var stats = yield fs.stat(file);
	return {
		folder: stats.isDirectory(),
		size: stats.size,
		mtime: stats.mtime.getTime()
	}
};

function *recursiveDir(dir) {
	var dirStats = [];
	var files = yield fs.readdir(dir);
	for (var i = 0; i < files.length; ++i) {
		if(! /^\..*/.test(files[i])) {
			var filePath = path.join(dir, files[i]);
			var stat = yield getFileStats(filePath);
			stat.path = dir;
			stat.name = files[i];
			if (stat.folder) {
				stat.childs = yield recursiveDir(dir + "/" + files[i]);
			}
			dirStats.push(stat);
		}
	}
	return dirStats;
}

function *recursiveDirs(dir) {
	return yield recursiveDir(dir);
}

function *getStatus() {
	this.body = yield dbKeyValueQuery('SELECT key, value FROM main.status');
}	

function *getNetworkItems() {
	this.body = yield dbListQuery('SELECT id, title, value, orderby FROM main.items WHERE type = 1 ORDER BY orderby');
}

function *getFmItems() {
	this.body = yield dbListQuery('SELECT id, title, value, orderby FROM main.items WHERE type = 2 ORDER BY orderby');
}

function *getMp3TrackFolder() {
	this.body = yield recursiveDirs(config.mediadir);
}

function *getMp3Playlists() {
	this.body = yield dbListQuery('SELECT id, title, value, orderby FROM main.items WHERE type = 3 ORDER BY orderby');
}

function *getMp3Tracks() {
	var id = this.params.id;
	this.body = yield dbTrackListQuery('SELECT id, author, title, path, orderby FROM main.tracks WHERE playlist_id = ' + id + ' ORDER BY orderby');
}

function *getNetParams() {
	var result = {};
	result.ssid = yield exec("uci get wireless.@wifi-iface[1].ssid");
	result.ssid = result.ssid.trim();
	result.encryption = yield exec("uci get wireless.@wifi-iface[1].encryption");
	result.encryption = result.encryption.trim();
	result.key = yield exec("uci get wireless.@wifi-iface[1].key");
	result.key = result.key.trim();
	this.body = result;
}

module.exports = router;