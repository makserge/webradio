'use strict';

import config from './config';
import constants from './constants';

const db = require('couchdb-promises')({
	baseUrl: config.couchDbUrl,
})

import mpd from 'mpd';

const client = mpd.connect({
  port: config.mpdPort,
  host: config.mpdHost
});

const mediaController = {
	async playWebRadioItem(itemId) {
		console.log('playWebRadioItem', itemId);
		try {
			const doc = await db.getDocument(config.couchDbName, constants.dbDocumentWebRadio);
			if (doc.data.state) {
				const item = doc.data.state.filter((item) => {
					return item[constants.dbId] == itemId;
				});
				if (item[0]) {
					const url = item[0][constants.dbWebRadioUrl];
					console.log(url);
					if (url) {
						const commandList = [
							constants.mpdClear,
							`${constants.mpdAdd} ${url}`,
							constants.mpdPlay,
						];
						client.sendCommands(commandList, () => {
							client.sendCommand(mpd.cmd("status", []), (err, msg) => {
								if (err) throw err;
								console.log(msg);
							});
						});
					}
				}
			}
		}
		catch(e) {
			console.log(e);
		}
	}
};

module.exports = mediaController;