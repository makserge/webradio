'use strict';
var router = require('koa-router')();
var config = require('./config');
var dblite = require('dblite');
var fs = require('co-fs');
var path = require('path');
var exec = require('co-exec');
var parse = require('co-body');

dblite.bin = config.sqlite;
var db = dblite('./webradio.sqlite');

router.get('/status', getStatus);
router.get('/network', getNetworkItems);
router.get('/fm', getFmItems);
router.get('/playertrackfolder', getPlayerTrackFolder);
router.get('/playerplaylist', getPlayerPlaylists);
router.get('/playerplaylist/tracks/:id', getPlayerPlaylistTracks);
router.get('/clock/datetime', getClockDateTime);
router.get('/clock/timezone', getClockTimeZone);
router.get('/netparams', getNetParams);

router.post('/fm/add', addFmItem);
router.post('/fm/update/:id', updateFmItem);
router.post('/fm/delete/:id', deleteFmItem);
router.post('/fm/play', playFm);

router.post('/network/add', addNetworkItem);
router.post('/network/update/:id', updateNetworkItem);
router.post('/network/delete/:id', deleteNetworkItem);
router.post('/network/play', playNetwork);

router.post('/playerplaylist/add', addPlayerPlaylist);
router.post('/playerplaylist/update/:id', updatePlayerPlaylist);
router.post('/playerplaylist/delete/:id', deletePlayerPlaylist);
router.post('/playerplaylist/index/:id', indexPlayerPlaylist);
router.post('/playerplaylist/play', playPlayerPlaylist);
router.post('/player/play', playPlayerTrack);

router.post('/volume/update', setVolume);
router.post('/mute/update', setMute);
router.post('/mode/update', setMode);
router.post('/clock/update', setClock);
router.post('/clock/updatetimezone', setClockTimeZone);
router.post('/sleep/update', setSleep);
router.post('/alarm1/update', setAlarm1);
router.post('/alarm2/update', setAlarm2);
router.post('/power/update', setPower);
router.post('/netparams/update', setNetParams);

function *dbKeyValueQuery(query) {
  return new Promise(function(resolve, reject) {
    db.query(query, ['key', 'value'],
		function (rows) {
			var result = {};
			for (var index in rows) {
				result[rows[index].key] = rows[index].value;
			}
			resolve(result);
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

function *dbTrackList(id) {
  return new Promise(function(resolve, reject) {
    db.query('SELECT id, author, title, path, orderby FROM main.tracks WHERE playlist_id = ? ORDER BY orderby', [id], ['id', 'author', 'title', 'path', 'order'],
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

function *getPlayerTrackFolder() {
	this.body = yield recursiveDirs(config.mediadir);
}

function *getPlayerPlaylists() {
	this.body = yield dbListQuery('SELECT id, title, value, orderby FROM main.items WHERE type = 3 ORDER BY orderby');
}

function *getPlayerPlaylistTracks() {
	var id = this.params.id;
	this.body = yield dbTrackList(id);
}

function *getClockDateTime() {
	var datetime = yield exec("date +'{\"year\":%Y,\"month\":%m,\"day\":%d,\"hour\":%H,\"minute\":%M,\"second\":%S}'");
	this.body = datetime.trim(); 
}

function *getClockTimeZone() {
	var data = yield exec("uci show system.@system[0].timezone");
	var timezone = data.split("=");
	this.body = timezone[1].trim(); 
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

function *addFmItem() {
	var params = yield parse(this);
	if (!params.order) this.throw(400, '.order required');
	if (!params.title) this.throw(400, '.title required');
	if (!params.value) this.throw(400, '.value required');

	if (yield checkItem(params, config.fmtype, 0)) {
		this.throw(422, 'duplicate item');
	}
	
	db.query('INSERT INTO main.items (type, orderby, title, value) VALUES(?, ?, ?, ?)', [config.fmtype, params.order, params.title, params.value]);

	var count = yield dbGetCount(config.fmtype, "", -1);
	
	yield exec("echo '10~" + count + "' > " + config.serialport);	
	log("echo '10~" + count + "' > " + config.serialport);
	
	this.body = "ok";
}

function *checkItem(params, type, id) {
	var count = yield dbGetCount(type, params.title.trim(), id);
	if (count > 0) {
		return true;
	}
	return false;
 }

function *dbGetCount(type, condition, id) {
  	var extra = "";
	if (condition && id != -1) {
		extra = " AND title = '" + condition + "' AND id != " + id;
	}
    return new Promise(function(resolve, reject) {
		db.query('SELECT COUNT(*) FROM main.items WHERE type = ' + type + extra, ['count'],
			function (rows) {
				resolve(rows[0].count);
			}
		);
	});
}

function *updateFmItem() {
	var id = this.params.id;
	var params = yield parse(this);
	if (!params.order) this.throw(400, '.order required');
	if (!params.title) this.throw(400, '.title required');
	if (!params.value) this.throw(400, '.value required');

	if (yield checkItem(params, config.fmtype, id)) {
		this.throw(422, 'duplicate item');
	}
	
	db.query('UPDATE main.items SET orderby = ?, title = ?, value = ? WHERE type = ? AND id = ?', [params.order, params.title, params.value, config.fmtype, id]);

	this.body = "ok";
}

function *deleteFmItem() {
	var id = this.params.id;

	db.query('DELETE FROM main.items WHERE type = ? AND id = ?', [config.fmtype, id]);

	var count = yield dbGetCount(config.fmtype, "", -1);
	
	yield exec("echo '10~" + count + "' > " + config.serialport);	
	log("echo '10~" + count + "' > " + config.serialport);
	
	this.body = "ok";
}

function *playFm() {
	var params = yield parse(this);
	if (!params.value) this.throw(400, '.value required');
	
	db.query('UPDATE main.status SET value = ? WHERE key = "fmPreset"', [params.value.trim()]);
	
	yield exec(config.scriptpath + "playpreset.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");
	log(config.scriptpath + "playpreset.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");
	
	this.body = "ok";
}

function *addNetworkItem() {
	var params = yield parse(this);
	if (!params.order) this.throw(400, '.order required');
	if (!params.title) this.throw(400, '.title required');
	if (!params.value) this.throw(400, '.value required');

	if (yield checkItem(params, config.networktype, 0)) {
		this.throw(422, 'duplicate item');
	}
	
	db.query('INSERT INTO main.items (type, orderby, title, value) VALUES(?, ?, ?, ?)', [config.networktype, params.order, params.title, params.value]);

	var count = yield dbGetCount(config.networktype, "", -1);
	
	yield exec("echo '9~" + count + "' > " + config.serialport);	
	log("echo '9~" + count + "' > " + config.serialport);
	
	this.body = "ok";
}

function *updateNetworkItem() {
	var id = this.params.id;
	var params = yield parse(this);
	if (!params.order) this.throw(400, '.order required');
	if (!params.title) this.throw(400, '.title required');
	if (!params.value) this.throw(400, '.value required');
	
	if (yield checkItem(params, config.networktype, id)) {
		this.throw(422, 'duplicate item');
	}

	db.query('UPDATE main.items SET orderby = ?, title = ?, value = ? WHERE type = ? AND id = ?', [params.order, params.title, params.value, config.networktype, id]);

	this.body = "ok";
}

function *deleteNetworkItem() {
	var id = this.params.id;

	db.query('DELETE FROM main.items WHERE type = ? AND id = ?', [config.networktype, id]);

	var count = yield dbGetCount(config.networktype, "", -1);
	
	yield exec("echo '9~" + count + "' > " + config.serialport);	
	log("echo '9~" + count + "' > " + config.serialport);
	
	this.body = "ok";
}

function *playNetwork() {
	var params = yield parse(this);
	if (!params.value) this.throw(400, '.value required');
	
	db.query('UPDATE main.status SET value = ? WHERE key = "networkPreset"', [params.value.trim()]);
	
	yield exec(config.scriptpath + "playstream.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");
	log(config.scriptpath + "playstream.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");
	
	this.body = "ok";
}

function *addPlayerPlaylist() {
	var params = yield parse(this);
	if (!params.order) this.throw(400, '.order required');
	if (!params.title) this.throw(400, '.title required');
	if (!params.value) this.throw(400, '.value required');

	if (yield checkItem(params, config.playertype, 0)) {
		this.throw(422, 'duplicate item');
	}
	
	db.query('INSERT INTO main.items (type, orderby, title, value) VALUES(?, ?, ?, ?)', [config.playertype, params.order, params.title, params.value]);

	var count = yield dbGetCount(config.playertype, "", -1);
	
	//yield exec("echo '9~" + count + "' > " + config.serialport);	
	//log("echo '9~" + count + "' > " + config.serialport);
	
	this.body = "ok";
}

function *updatePlayerPlaylist() {
	var id = this.params.id;
	var params = yield parse(this);
	if (!params.order) this.throw(400, '.order required');
	if (!params.title) this.throw(400, '.title required');
	if (!params.value) this.throw(400, '.value required');
	
	if (yield checkItem(params, config.playertype, id)) {
		this.throw(422, 'duplicate item');
	}

	db.query('UPDATE main.items SET orderby = ?, title = ?, value = ? WHERE type = ? AND id = ?', [params.order, params.title, params.value, config.playertype, id]);

	this.body = "ok";
}

function *deletePlayerPlaylist() {
	var id = this.params.id;

	db.query('DELETE FROM main.items WHERE type = ? AND id = ?', [config.playertype, id]);
	db.query('DELETE FROM main.tracks WHERE playlist_id = ?', [id]);

	var count = yield dbGetCount(config.networktype, "", -1);
	
	//yield exec("echo '9~" + count + "' > " + config.serialport);	
	//log("echo '9~" + count + "' > " + config.serialport);
	
	this.body = "ok";
}

function *playPlayerPlaylist() {
	var params = yield parse(this);
	if (!params.value) this.throw(400, '.value required');
	
	db.query('UPDATE main.status SET value = ? WHERE key = "playerPlaylist"', [params.value.trim()]);
	
	this.body = "ok";
}

function *indexPlayerPlaylist() {
	this.body = "ok";
}

function *playPlayerTrack() {
	var params = yield parse(this);
	if (!params.value) this.throw(400, '.value required');
	
	db.query('UPDATE main.status SET value = ? WHERE key = "playerTrack"', [params.value.trim()]);
	
	//yield exec(config.scriptpath + "stopstream.sh");
	log(config.scriptpath + "stopstream.sh");	
	//yield exec(config.scriptpath + "playmp3.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");
	log(config.scriptpath + "playmp3.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");
	
	this.body = "ok";
}

function *dbKeyValueQuery(query) {
  return new Promise(function(resolve, reject) {
    db.query(query, ['key', 'value'],
		function (rows) {
			var result = {};
			for (var index in rows) {
				result[rows[index].key] = rows[index].value;
			}
			resolve(result);
		}
	);
  });
}

function *setVolume() {
	var params = yield parse(this);
	if (!params.value) this.throw(400, '.value required');
	
	yield setValue(params, "volume", 3);
	
	this.body = "ok";
}

function *setMute() {
	var params = yield parse(this);
	if (!params.value) this.throw(400, '.value required');
	
	yield setValue(params, "mute", 1);
	
	this.body = "ok";
}

function *setMode() {
	var params = yield parse(this);
	
	var mode = params.value.trim();
	
	if (!mode) this.throw(400, '.value required');
	
	db.query('UPDATE main.status SET value=? WHERE key=?', [mode, "mode"]);
	
	switch (mode) {
		case "fm":
			mode = 1;
			break;
		case "network":
			mode = 2;
			break;
		case "player":
			mode = 3;
			break;
		case "linein":
			mode = 4;
			break;
		case "airplay":	
			mode = 5;
			break;
	}
		
	yield exec("echo '2~" + mode + "' > " + config.serialport);	
	log("echo '2~" + mode + "' > " + config.serialport);
	
	yield exec(config.scriptpath + "stopstream.sh 1>/dev/null 2>&1 &");
	
	this.body = "ok";
}

function *setClock() {
	var date = yield exec("date +'%Y~%m-%d~%H~%M~%S'");
	
	yield exec("echo '6~" + date.trim() + "' > " + config.serialport);
	
	log("echo '6~" + date.trim() + "' > " + config.serialport);
	
	this.body = "ok";
}

function *setClockTimeZone() {
	var params = yield parse(this);
	if (!params.value) this.throw(400, '.value required');
	
	yield exec("uci set system.@system[0].timezone=" + params.value.trim());
	yield exec("uci commit system");
 	yield exec("reboot");
	this.body = "ok";
}

function *setSleep() {
	var params = yield parse(this);
	if (!params.value) this.throw(400, '.value required');
	
	yield setValue(params, "sleep", 5);
	
	this.body = "ok";
}

function *setAlarm1() {
	var params = yield parse(this);
	if (!params.value) this.throw(400, '.value required');
	
	yield setValue(params, "alarm1", 7);
	
	this.body = "ok";
}

function *setAlarm2() {
	var params = yield parse(this);
	if (!params.value) this.throw(400, '.value required');
	
	yield setValue(params, "alarm2", 8);
	
	this.body = "ok";
}

function *setPower() {
	var params = yield parse(this);
	if (!params.value) this.throw(400, '.value required');
	
	yield setValue(params, "power", 15);
	
	this.body = "ok";
}

function *setValue(params, dbKey, serialKey) {
	db.query('UPDATE main.status SET value = ? WHERE key = ?', [params.value.trim(), dbKey]);

	yield exec("echo '" + serialKey + "~" + params.value.trim() + "' > " + config.serialport);
	
	log("echo '" + serialKey + "~" + params.value.trim() + "' > " + config.serialport);
}

function *setNetParams() {
	var params = yield parse(this);
	
	if (!params.ssid) this.throw(400, '.ssid required');
	if (!params.encryption) this.throw(400, '.encryption required');
	if (!params.key) this.throw(400, '.key required');
	
	if (params.ssid.length) {
		yield exec("uci set wireless.@wifi-iface[1].ssid=" + params.ssid.trim());
	}
	if (params.encryption.length) {
		yield exec("uci set wireless.@wifi-iface[1].encryption=" + params.encryption.trim());
	}
	if (params.key.length) {
		yield exec("uci set wireless.@wifi-iface[1].key=" + params.key.trim());
	}	

	yield exec("uci commit wireless");
	yield exec("wifi down");
	yield exec("wifi up");
	
	this.body = "ok";
}

function log(data) {
	if (config.debug == 1) {
		console.log(data);
	}
}

module.exports = router;