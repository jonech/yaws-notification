
const db = require('../src/db');

db.all('SELECT * FROM wfstats', function(err, rows) {
  if (err) {
    console.error(err.message);
  }
  console.log(rows);
});

db.close();