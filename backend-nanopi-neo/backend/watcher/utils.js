import follow from 'follow';

export const dbDocumentWatcher = (dbUrl, dbName, documentId, changeCallback) => {
  const params = {
		db: dbUrl + '/' + dbName,
		since: 'now',
		include_docs: true,
		filter: (doc, req) => {
			return (doc._id == documentId);
		}
	};
	const feed = new follow.Feed(params);
  feed.follow();
  feed.on('change', (change) => {
	  changeCallback(change);
  });
};

export const checkDbFieldChanges = (field, state, newState) => {
	const newValue = newState[field];
	if (newValue != state[field]) {
		state[field] = newValue;
		return newValue;
	}
  return null;
};

export const getObjectDiff = (obj1, obj2, titleField, valueField) => {
	let diff;

	const ids1 = obj1.map(item => item.id);
	const ids2 = obj2.map(item => item.id);

	diff = ids2.map((id, index) => {
		if (ids1.indexOf(id) < 0) {
			return { action: 'add', item: obj2[index] };
		}
	}).filter(item => item != undefined);
	if (diff.length === 0) {
		diff = ids1.map((id, index) => {
			if (ids2.indexOf(id) < 0) {
				return { action: 'delete', item: obj1[index] };
			}
		}).filter(item => item != undefined);
	}
	if (diff.length === 0) {
		diff = ids1.map((id, index) => {
			const item1 = obj1[index];
			const item2 = obj2[index];
			if (item1[valueField] !== item2[valueField]) {
				return { action: 'rescan', item: obj2[index] };
			}
		})
		.filter(item => item != undefined);
	}
	return diff;
};
