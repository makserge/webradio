'use strict';
import KoaRouter from 'koa-router';
import config from './config';
//import dblite from 'dblite';
import * as fs from 'async-file';
import path from 'path';
//const exec = require('co-exec');

const router = KoaRouter();
//dblite.bin = config.sqlite;
//const db = dblite(config.sqliteDb);

router.get('/status', async (ctx) => {
	ctx.body = await dbKeyValueQuery('SELECT key, value FROM main.status');
});

router.get('/network', async (ctx) => {
	ctx.body = await dbListQuery('SELECT id, title, value, orderby FROM main.items WHERE type = 1 ORDER BY orderby');
});

router.get('/fm', async (ctx) => {
	ctx.body = await dbListQuery('SELECT id, title, value, orderby FROM main.items WHERE type = 2 ORDER BY orderby');
});

router.get('/playertrackfolder', async (ctx) => {
	ctx.body = await recursiveDir(config.mediadir);
});

router.get('/playerplaylist', async (ctx) => {
	ctx.body = await dbListQuery('SELECT id, title, value, orderby FROM main.items WHERE type = 3 ORDER BY orderby');
});

router.get('/playerplaylist/tracks/:id', async (ctx) => {
	ctx.body = await dbTrackList(ctx.params.id);
});

router.get('/clock/datetime', async (ctx) => {
	const datetime = await exec("date +'{\"year\":%Y,\"month\":%m,\"day\":%d,\"hour\":%H,\"minute\":%M,\"second\":%S}'");
	ctx.body = datetime.trim();
});

router.get('/netparams', async (ctx) => {
	let result = {};
	result.ssid = await exec("uci get wireless.@wifi-iface[1].ssid");
	result.ssid = result.ssid.trim();
	result.encryption = await exec("uci get wireless.@wifi-iface[1].encryption");
	result.encryption = result.encryption.trim();
	result.key = await exec("uci get wireless.@wifi-iface[1].key");
	result.key = result.key.trim();
	ctx.body = result;
});

router.post('/fm/add', async (ctx) => {
	const params = ctx.request.body;
	if (!params.order) ctx.throw(400, '.order required');
	if (!params.title) ctx.throw(400, '.title required');
	if (!params.value) ctx.throw(400, '.value required');
	if (await checkItem(params, config.fmtype, 0)) {
		ctx.throw(422, 'duplicate item');
	}

	//await db.query('INSERT INTO main.items (type, orderby, title, value) VALUES(?, ?, ?, ?)', [config.fmtype, params.order, params.title, params.value]);
	const count = await dbGetCount(config.fmtype, "", -1);
	await exec("echo '10~" + count + "' > " + config.serialport);
	log("echo '10~" + count + "' > " + config.serialport);

	ctx.body = "ok";
});

router.post('/fm/update/:id', async (ctx) => {
	const id = ctx.params.id;
	const params = ctx.request.body;
	if (!params.order) ctx.throw(400, '.order required');
	if (!params.title) ctx.throw(400, '.title required');
	if (!params.value) ctx.throw(400, '.value required');
	if (await checkItem(params, config.fmtype, id)) {
		ctx.throw(422, 'duplicate item');
	}

	// await db.query('UPDATE main.items SET orderby = ?, title = ?, value = ? WHERE type = ? AND id = ?', [params.order, params.title, params.value, config.fmtype, id]);

	ctx.body = "ok";
});

router.post('/fm/delete/:id', async (ctx) => {
	const id = ctx.params.id;

	await db.query('DELETE FROM main.items WHERE type = ? AND id = ?', [config.fmtype, id]);

	const count = await dbGetCount(config.fmtype, "", -1);
	await exec("echo '10~" + count + "' > " + config.serialport);
	log("echo '10~" + count + "' > " + config.serialport);

	ctx.body = "ok";
});

router.post('/fm/play', async (ctx) => {
	const params = ctx.request.body;
	if (!params.value) ctx.throw(400, '.value required');

	//await db.query('UPDATE main.status SET value = ? WHERE key = "fmPreset"', [params.value.trim()]);
	await exec(config.scriptpath + "playpreset.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");
	log(config.scriptpath + "playpreset.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");

	ctx.body = "ok";
});

router.post('/network/add', async (ctx) => {
	const params = ctx.request.body;
	if (!params.order) ctx.throw(400, '.order required');
	if (!params.title) ctx.throw(400, '.title required');
	if (!params.value) ctx.throw(400, '.value required');
	if (await checkItem(params, config.networktype, 0)) {
		ctx.body = '{"result": "duplicate item"}';
	}
	else {
		//await db.query('INSERT INTO main.items (type, orderby, title, value) VALUES(?, ?, ?, ?)', [config.networktype, params.order, params.title, params.value]);

		const count = await dbGetCount(config.networktype, "", -1);
		await exec("echo '9~" + count + "' > " + config.serialport);
		log("echo '9~" + count + "' > " + config.serialport);

		ctx.body = '{"result": "ok"}';
	}
});

router.post('/network/update/:id', async (ctx) => {
	const id = ctx.params.id;
	const params = ctx.request.body;
	if (!params.order) ctx.throw(400, '.order required');
	if (!params.title) ctx.throw(400, '.title required');
	if (!params.value) ctx.throw(400, '.value required');

	if (await checkItem(params, config.networktype, id)) {
		ctx.throw(422, 'duplicate item');
	}

	//await db.query('UPDATE main.items SET orderby = ?, title = ?, value = ? WHERE type = ? AND id = ?', [params.order, params.title, params.value, config.networktype, id]);

	ctx.body = "ok";
});

router.post('/network/delete/:id', async (ctx) => {
	const id = ctx.params.id;

	await db.query('DELETE FROM main.items WHERE type = ? AND id = ?', [config.networktype, id]);

	const count = await dbGetCount(config.networktype, "", -1);

	await exec("echo '9~" + count + "' > " + config.serialport);
	log("echo '9~" + count + "' > " + config.serialport);

	ctx.body = "ok";
});

router.post('/network/play', async (ctx) => {
	const params = ctx.request.body;
	if (!params.value) ctx.throw(400, '.value required');

	//await db.query('UPDATE main.status SET value = ? WHERE key = "networkPreset"', [params.value.trim()]);

	await exec(config.scriptpath + "playstream.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");
	log(config.scriptpath + "playstream.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");

	ctx.body = "ok";
});

router.post('/playerplaylist/add', async (ctx) => {
	const params = ctx.request.body;
	if (!params.order) ctx.throw(400, '.order required');
	if (!params.title) ctx.throw(400, '.title required');
	if (!params.value) ctx.throw(400, '.value required');

	if (await checkItem(params, config.playertype, 0)) {
		ctx.throw(422, 'duplicate item');
	}

	//await db.query('INSERT INTO main.items (type, orderby, title, value) VALUES(?, ?, ?, ?)', [config.playertype, params.order, params.title, params.value]);

	const count = await dbGetCount(config.playertype, "", -1);

	//yield exec("echo '9~" + count + "' > " + config.serialport);
	//log("echo '9~" + count + "' > " + config.serialport);

	ctx.body = "ok";
});

router.post('/playerplaylist/update/:id', async (ctx) => {
	const id = ctx.params.id;
	const params = ctx.request.body;
	if (!params.order) ctx.throw(400, '.order required');
	if (!params.title) ctx.throw(400, '.title required');
	if (!params.value) ctx.throw(400, '.value required');

	if (await checkItem(params, config.playertype, id)) {
		ctx.throw(422, 'duplicate item');
	}

	//await db.query('UPDATE main.items SET orderby = ?, title = ?, value = ? WHERE type = ? AND id = ?', [params.order, params.title, params.value, config.playertype, id]);

	ctx.body = "ok";
});

router.post('/playerplaylist/delete/:id', async (ctx) => {
	const id = ctx.params.id;

	//await db.query('DELETE FROM main.items WHERE type = ? AND id = ?', [config.playertype, id]);
	//await db.query('DELETE FROM main.tracks WHERE playlist_id = ?', [id]);

	const count = await dbGetCount(config.networktype, "", -1);

	//yield exec("echo '9~" + count + "' > " + config.serialport);
	//log("echo '9~" + count + "' > " + config.serialport);

	ctx.body = "ok";
});

router.post('/playerplaylist/index/:id', async (ctx) => {
	ctx.body = "ok";
});

router.post('/playerplaylist/play', async (ctx) => {
	const params = ctx.request.body;
	if (!params.value) ctx.throw(400, '.value required');

	//await db.query('UPDATE main.status SET value = ? WHERE key = "playerPlaylist"', [params.value.trim()]);

	ctx.body = "ok";
});

router.post('/player/play', async (ctx) => {
	const params = ctx.request.body;
	if (!params.value) ctx.throw(400, '.value required');

	//await db.query('UPDATE main.status SET value = ? WHERE key = "playerTrack"', [params.value.trim()]);

	//yield exec(config.scriptpath + "stopstream.sh");
	log(config.scriptpath + "stopstream.sh");
	//yield exec(config.scriptpath + "playmp3.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");
	log(config.scriptpath + "playmp3.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");

	ctx.body = "ok";
});

router.post('/volume/update', async (ctx) => {
	const params = ctx.request.body;
	if (!params.value) ctx.throw(400, '.value required');

	await setValue(params, "volume", 3);

	ctx.body = "ok";
});

router.post('/mute/update', async (ctx) => {
	const params = ctx.request.body;
	if (!params.value) ctx.throw(400, '.value required');

	await setValue(params, "mute", 1);

	ctx.body = "ok";
});

router.post('/mode/update', async (ctx) => {
	const params = ctx.request.body;

	const mode = params.value.trim();
	if (!mode) ctx.throw(400, '.value required');

	//await db.query('UPDATE main.status SET value=? WHERE key=?', [mode, "mode"]);

	let serialMode = 1;

	switch (mode) {
		case "fm":
			serialMode = 1;
			break;
		case "network":
			serialMode = 2;
			break;
		case "player":
			serialMode = 3;
			break;
		case "linein":
			serialMode = 4;
			break;
		case "airplay":
			serialMode = 5;
			break;
		default:
			serialMode = 1;
	}

	await exec("echo '2~" + serialMode + "' > " + config.serialport);
	log("echo '2~" + serialMode + "' > " + config.serialport);

	await exec(config.scriptpath + "stopstream.sh 1>/dev/null 2>&1 &");

	ctx.body = "ok";
});

router.post('/clock/update', async (ctx) => {
	const params = ctx.request.body;
	if (!params.value) ctx.throw(400, '.value required');

	await exec("uci set system.@system[0].timezone=" + params.value.trim());
	await exec("uci commit system");
 	await exec("reboot");

	ctx.body = "ok";
});

router.post('/sleep/update', async (ctx) => {
	const params = ctx.request.body;
	if (!params.value) ctx.throw(400, '.value required');

	await setValue(params, "sleep", 5);

	ctx.body = "ok";
});

router.post('/alarm1/update', async (ctx) => {
	const params = ctx.request.body;
	if (!params.value) ctx.throw(400, '.value required');

	await setValue(params, "alarm1", 7);

	ctx.body = "ok";
});

router.post('/alarm2/update', async (ctx) => {
	const params = ctx.request.body;
	if (!params.value) ctx.throw(400, '.value required');

	await setValue(params, "alarm2", 8);

	ctx.body = "ok";
});

router.post('/power/update', async (ctx) => {
	const params = ctx.request.body;
	if (!params.value) ctx.throw(400, '.value required');

	await setValue(params, "power", 15);

	ctx.body = "ok";
});

router.post('/netparams/update', async (ctx) => {
	const params = ctx.request.body;

	if (!params.ssid) ctx.throw(400, '.ssid required');
	if (!params.encryption) ctx.throw(400, '.encryption required');
	if (!params.key) ctx.throw(400, '.key required');

	if (params.ssid.length) {
		await exec("uci set wireless.@wifi-iface[1].ssid=" + params.ssid.trim());
	}
	if (params.encryption.length) {
		await exec("uci set wireless.@wifi-iface[1].encryption=" + params.encryption.trim());
	}
	if (params.key.length) {
		await exec("uci set wireless.@wifi-iface[1].key=" + params.key.trim());
	}

	await exec("uci commit wireless");
	await exec("wifi down");
	await exec("wifi up");

	ctx.body = "ok";
});

async function dbKeyValueQuery(query) {
  return new Promise(function(resolve, reject) {
    /*db.query(query, ['key', 'value'],
		function (rows) {
			let result = {};
			for (let index in rows) {
				result[rows[index].key] = rows[index].value;
			}
			resolve(result);
		}
	);*/
		resolve({});
  });
}

async function dbListQuery(query) {
  return new Promise(function(resolve, reject) {
    /*db.query(query, ['id', 'title', 'value', 'order'],
		function (rows) {
			resolve(rows);
		}
	);*/
		resolve({});
  });
}

async function recursiveDir(dir) {
	let dirStats = [];
	let files = await fs.readdir(dir);
	for (let i = 0; i < files.length; ++i) {
		if(! /^\..*/.test(files[i])) {
			let filePath = path.join(dir, files[i]);
			let stat = await getFileStats(filePath);
			stat.path = dir;
			stat.name = files[i];
			if (stat.folder) {
				stat.childs = await recursiveDir(dir + "/" + files[i]);
			}
			dirStats.push(stat);
		}
	}
	return dirStats;
}

async function getFileStats(file) {
	let stats = await fs.stat(file);
	return {
		folder: stats.isDirectory(),
		size: stats.size,
		mtime: stats.mtime.getTime()
	}
};

async function dbGetCount(type, condition, id) {
  	let extra = "";
	if (condition && id != -1) {
		extra = " AND title = '" + condition + "' AND id != " + id;
	}
    return new Promise(function(resolve, reject) {
		//db.query('SELECT COUNT(*) FROM main.items WHERE type = ' + type + extra, ['count'],
		//	function (rows) {
		//		resolve(rows[0].count);
		//	}
		//);
		resolve(1);
	});
}

function log(data) {
	if (config.debug == 1) {
		console.log(data);
	}
}

async function setValue(params, dbKey, serialKey) {
	//await db.query('UPDATE main.status SET value = ? WHERE key = ?', [params.value.trim(), dbKey]);

	await exec("echo '" + serialKey + "~" + params.value.trim() + "' > " + config.serialport);

	log("echo '" + serialKey + "~" + params.value.trim() + "' > " + config.serialport);
}

/*router.get('/', getStatus);

async function getStatus(ctx) {
 	ctx.body = await dbKeyValueQuery('SELECT key, value FROM main.status');
}


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
*/
async function recursiveDir1(dir) {
	var dirStats = [];
	var files = await fs.readdir(dir);
	for (var i = 0; i < files.length; ++i) {
		if(! /^\..*/.test(files[i])) {
			var filePath = path.join(dir, files[i]);
			var stat = await getFileStats(filePath);
			stat.path = dir;
			stat.name = files[i];
			if (stat.folder) {
				stat.childs = await recursiveDir(dir + "/" + files[i]);
			}
			dirStats.push(stat);
		}
	}
	return dirStats;
}
/*
function *recursiveDirs(dir) {
	return yield recursiveDir(dir);
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
	var params = this.request.body;
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
	var params = this.request.body;
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
	var params = this.request.body;
	if (!params.value) this.throw(400, '.value required');

	db.query('UPDATE main.status SET value = ? WHERE key = "fmPreset"', [params.value.trim()]);

	yield exec(config.scriptpath + "playpreset.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");
	log(config.scriptpath + "playpreset.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");

	this.body = "ok";
}

function *addNetworkItem() {
	var params = this.request.body;
	if (!params.order) this.throw(400, '.order required');
	if (!params.title) this.throw(400, '.title required');
	if (!params.value) this.throw(400, '.value required');

	if (yield checkItem(params, config.networktype, 0)) {
		this.body = '{"result": "duplicate item"}';
	}
	else {
		db.query('INSERT INTO main.items (type, orderby, title, value) VALUES(?, ?, ?, ?)', [config.networktype, params.order, params.title, params.value]);

		var count = yield dbGetCount(config.networktype, "", -1);

		yield exec("echo '9~" + count + "' > " + config.serialport);
		log("echo '9~" + count + "' > " + config.serialport);

		this.body = '{"result": "ok"}';
	}
}

function *updateNetworkItem() {
	var id = this.params.id;
	var params = this.request.body;
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
	var params = this.request.body;
	if (!params.value) this.throw(400, '.value required');

	db.query('UPDATE main.status SET value = ? WHERE key = "networkPreset"', [params.value.trim()]);

	yield exec(config.scriptpath + "playstream.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");
	log(config.scriptpath + "playstream.sh " + params.value.trim() + " 1>/dev/null 2>&1 &");

	this.body = "ok";
}

function *addPlayerPlaylist() {
	var params = this.request.body;
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
	var params = this.request.body;
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
	var params = this.request.body;
	if (!params.value) this.throw(400, '.value required');

	db.query('UPDATE main.status SET value = ? WHERE key = "playerPlaylist"', [params.value.trim()]);

	this.body = "ok";
}

function *indexPlayerPlaylist() {
	this.body = "ok";
}

function *playPlayerTrack() {
	var params = this.request.body;
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
	var params = this.request.body;
	if (!params.value) this.throw(400, '.value required');

	yield setValue(params, "volume", 3);

	this.body = "ok";
}

function *setMute() {
	var params = this.request.body;
	if (!params.value) this.throw(400, '.value required');

	yield setValue(params, "mute", 1);

	this.body = "ok";
}

function *setMode() {
	var params = this.request.body;

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
	var params = this.request.body;
	if (!params.value) this.throw(400, '.value required');

	yield exec("uci set system.@system[0].timezone=" + params.value.trim());
	yield exec("uci commit system");
 	yield exec("reboot");
	this.body = "ok";
}

function *setSleep() {
	var params = this.request.body;
	if (!params.value) this.throw(400, '.value required');

	yield setValue(params, "sleep", 5);

	this.body = "ok";
}

function *setAlarm1() {
	var params = this.request.body;
	if (!params.value) this.throw(400, '.value required');

	yield setValue(params, "alarm1", 7);

	this.body = "ok";
}

function *setAlarm2() {
	var params = this.request.body;
	if (!params.value) this.throw(400, '.value required');

	yield setValue(params, "alarm2", 8);

	this.body = "ok";
}

function *setPower() {
	var params = this.request.body;
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
	var params = this.request.body;

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
*/
module.exports = router;
