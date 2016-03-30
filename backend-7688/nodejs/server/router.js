'use strict';
let router = require('koa-router')();
let config = require('./config');
let dblite = require('dblite');
dblite.bin = config.sqlite;

router.get('/statusfm', getStatusFm);
/*
router.get('/statusnetwork', getStatusNetwork);
router.get('/statusmp3', getStatusMp3);
router.get('/statuslinein', getStatusLineIn);
router.get('/statusairplay', getStatusAirplay);
router.get('/statussettings', getStatusSettings);
router.get('/curfmpreset', getCurFmPreset);
router.get('/network', getNetwork);
router.get('/curnetwork', getCurNetwork);
router.get('/fm', getFm);
router.get('/mp3trackfolder', getMp3TrackFolder);
router.get('/mp3playlist', getMp3Playlist);
router.get('/curmp3playlist', getCurMp3Playlist);
router.get('/mp3track', getMp3Track);
router.get('/curmp3track', getCurMp3Track);
router.get('/volume', getVolume);
router.get('/mute', getMute);
router.get('/mode', getMode);
router.get('/sleep', getSleep);
router.get('/alarm1', getAlarm1);
router.get('/alarm2', getAlarm2);
router.get('/netparams', getNetParams);

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

function *getStatusFm() {
	this.body = "/";
}	

/*

function *list() {

var db = dblite('./webradio.db');

var start = Date.now();

//db.query('CREATE TABLE lorem (info TEXT)');
//db.query('BEGIN');
//for (var i = 0; i < 10; i++) {
//  db.query(
//    'INSERT INTO lorem VALUES (?)',
//    ['Ipsum ' + i]
//  );
//}
//db.query('COMMIT');
db.query(
  'SELECT rowid, info FROM lorem',
  // retrieved as
  ['id', 'info'],
  // once retrieved
  function (rows) {
    rows.forEach(eachRow);
  }
);

function eachRow(row, i, rows) {
  console.log(row.id + ": " + row.info);
  if ((i + 1) === rows.length) {
    start = Date.now() - start;
    console.log(start);
    db.close();
  }
}

	this.body = "/";
  //this.body = yield render('index', { todos: todos });
}


function *add() {
  //this.body = yield render('new');
}


function *edit(id) {
    var todo = todos[id];
    if (!todo) this.throw(404, 'invalid todo id');
  //  this.body = yield render('edit', { todo: todo });
}



function *show(id) {
  var todo = todos[id];
  if (!todo) this.throw(404, 'invalid todo id');
 // this.body = yield render('show', { todo: todo });
//	this.body = yield this.db.get('SELECT * FROM testtable WHERE id < ? ORDER BY ID DESC ' ,[50])
}


function *remove(id) {
    var todo = todos[id];
    if (!todo) this.throw(404, 'invalid todo id');
   todos.splice(id,1);
    //Changing the Id for working with index
    for (var i = 0; i < todos.length; i++)
    {
        todos[i].id=i;
    }
    this.redirect('/');
}


function *create() {
  var todo = yield parse(this);
  todo.created_on = new Date;
  todo.updated_on = new Date;
  var id = todos.push(todo);
  todo.id = id-1;//Id with index of the array
  this.redirect('/');
}


function *update() {
    var todo = yield parse(this);
    var index=todo.id;
    todos[index].name=todo.name;
    todos[index].description=todo.description;
    todos[index].updated_on = new Date;
    this.redirect('/');
}
*/

module.exports = router;