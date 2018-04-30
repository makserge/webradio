import chokidar from 'chokidar';
import Queue from 'better-queue';
import fs from 'fs';
import path from 'path';

import config from '../config';
import constants from '../constants';

const walkContentFoldersTree = (dir, isCancelled) => {
  const walk = (entry, isWalkCancelled, isTop) => {
    return new Promise((resolve, reject) => {
      if (isWalkCancelled) {
        return resolve({});
      }
      fs.exists(entry, (exists) => {
        if (!exists) {
          return reject(new Error(`Path ${entry} is not exists`));
        }
        return resolve(new Promise((resolveChild, rejectChild) => {
          fs.lstat(entry, (err, stats) => {
            if (err) {
              return rejectChild(err);
            }
            if (stats.isFile()) {
              return resolveChild({
                title: '',
              });
            }
            resolve(new Promise((resolveChild1, rejectChild1) => {
              fs.readdir(entry, (childError, files) => {
                if (childError) {
                  return reject(childError);
                }
                Promise.all(files.map(child => walk(path.join(entry, child), isCancelled, false)))
                  .then((children) => {
                    children = children.filter(item => item.title !== '');
                    const result = isTop ? { madeBy: 'watcher', state: children } : { title: path.basename(entry), children };
                    resolveChild1(result);
                  }).catch((error) => {
                    rejectChild1(error);
                  });
              });
            }));
          });
        }));
      });
    });
  };
  return walk(dir, isCancelled, true);
};

export default (db) => {
  const dbName = config.couchDbName;
  const watcher = chokidar.watch(config.contentDir, {
    ignored: /(^|[/\\])\../,
    persistent: true,
    followSymlinks: true,
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
      } catch (e) {
        console.log(e);
      }
      await db.createDocument(dbName, folderTree, constants.dbDocumentContentDirTree);
      return {
        cancel: () => {
          isCancelled = true;
        },
      };
    },
    { id: 'id', cancelIfRunning: true },
  );

  let isInit = false;

  watcher
    .on('ready', () => { isInit = true; queue.push({ id: 'scanDir' }); })
    .on('addDir', () => { if (isInit) queue.push({ id: 'scanDir' }); })
    .on('unlinkDir', () => { if (isInit) queue.push({ id: 'scanDir' }); });
};
