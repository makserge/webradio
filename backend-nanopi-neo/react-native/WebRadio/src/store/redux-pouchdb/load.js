export default db => _id =>
  db.get(_id)
  .catch(err => {
    if (err.status === 404) {
      return { _id };
    }
    throw err;
  })
  .catch(console.error.bind(console));
