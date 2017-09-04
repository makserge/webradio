import chokidar from 'chokidar';
import Queue from 'better-queue';
import fs from 'fs';
import path from 'path';

import config from '../config';
import constants from '../constants';

const walkContentFoldersTree = (dir, isCancelled) => {
  const walk = (entry, isCancelled, isTop) => {
    return new Promise((resolve, reject) => {
		if (isCancelled) {
			return resolve({});
		}
		fs.exists(entry, exists => {
			if (!exists) {
				return reject(`Path ${entry} is not exists`);
			}
			return resolve(new Promise((resolve, reject) => {
				fs.lstat(entry, (err, stats) => {
					if (err) {
						return reject(err);
					}
					if (stats.isFile()) {
						return resolve({
							title: '',
						});
					}
					resolve(new Promise((resolve, reject) => {
						fs.readdir(entry, (err, files) => {
							if (err) {
								return reject(err);
							}
							Promise.all(files.map(child => walk(path.join(entry, child), isCancelled, false))).then(children => {
								children = children.filter(item => item.title !== '');
								resolve(isTop ?
									{
										madeBy: 'watcher',
										state: children
									}
									:
									{
										title: path.basename(entry),
										children: children
									}
								);
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
  return walk(dir, isCancelled, true);
};

export default (db) => {
  const dbName = config.couchDbName;
  const watcher = chokidar.watch(config.contentDir, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    followSymlinks: true
  });

  const queue = new Queue(
    async () => {
      let isCancelled = false;
      let folderTree = [];
      try {
        folderTree = await walkContentFoldersTree(config.contentDir, isCancelled);
        if (!isCancelled) {
          const doc = await db.getDocument(dbName, constants.dbDocumentContentDirTree);
            if (doc.data) {
              folderTree._rev = doc.data._rev;
            }
          }
      }
      catch(e) {
        console.log(e);
      }
      await db.createDocument(dbName, folderTree, constants.dbDocumentContentDirTree);
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
