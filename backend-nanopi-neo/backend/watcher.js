'use strict';
import chokidar from 'chokidar';
import Queue from 'better-queue';
import fs from 'fs';
import path from 'path';

import config from './config';

var nano = require('nano')(config.couchDbUrl);

import constants from './constants';

var db = nano.use(config.couchDbName);

const watcher = {
  init() {
    const watcher = chokidar.watch(config.contentDir, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

	const walkTree = (dir, isCancelled) => {
		const walk = (entry, isCancelled) => {
			return new Promise((resolve, reject) => {
				if (isCancelled) {
					return resolve({});
				}	
				fs.exists(entry, exists => {
					if (!exists) {
						return resolve({});
					}
					return resolve(new Promise((resolve, reject) => {
						fs.lstat(entry, (err, stats) => {
							if (err) {
								return reject(err);
							}
							if (!stats.isDirectory()) {
								return resolve({
									title: path.basename(entry),
								});
							}
							resolve(new Promise((resolve, reject) => {
								fs.readdir(entry, (err, files) => {
									if (err) {
										return reject(err);
									}
									Promise.all(files.map(child => walk(path.join(entry, child), isCancelled))).then(children => {
										resolve({
											title: path.basename(entry),
											children: children
										});
									}).catch(err => {
										reject(err);
									});
								});
							}));
						});
					}));
				});
			});
		}
		return walk(dir, isCancelled);
	};
	
	const queue = new Queue(
		async function () {
			let isCancelled = false;  
			let folderTree = await walkTree(config.contentDir, isCancelled);
			if (!isCancelled) {
				db.get(constants.contentDirTreeDbKey, (error, existing) => { 
					if (!error) {
						folderTree._rev = existing._rev;
					}	
					db.insert(folderTree, constants.contentDirTreeDbKey, () => {});
				});
			}	
			return {
				cancel: () => {
					isCancelled = true;
				}
			}
		},
		{ id: 'id', cancelIfRunning: true }
	);
	
    let isInit = false;

    watcher
      .on('ready', () => { isInit = true; queue.push({ id: 'scanDir' }); })
      .on('addDir', () => { if (isInit) queue.push({ id: 'scanDir' }); })
      .on('unlinkDir', () => { if (isInit) queue.push({ id: 'scanDir' }); });
  }
 
};

module.exports = watcher;