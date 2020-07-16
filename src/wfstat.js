const db = require('./db');
const constant = require('./constant');

const tableName = 'wfstats';

function createTable() {
  let sql = `CREATE TABLE IF NOT EXISTS ${tableName}(
    id INTEGER PRIMARY KEY, 
    stat_id TEXT NOT NULL,
    stat_type TEXT NOT NULL
  );`;

  return new Promise((resolve, reject) => {
    db.run(sql, function(err) {
      if (err) {
        console.error(err.message);
        reject(err.message);
      }
      console.log(`${tableName} table created.`)
      resolve();
    });
  });
}

function deleteRow(id) {
  let sql = `DELETE FROM ${tableName} WHERE id = ?;`;
  let param = [id];

  return new Promise((resolve, reject) => {
    db.run(sql, param, function(err) {
      if (err) {
        console.error(err.message);
        reject(err.message);
      }
      // get the last deleted id
      console.log(`A row has been deleted with rowid ${this.changes}`);
      resolve();
    });
  });
}

function insertRow(statId, statType) {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO ${tableName} (stat_id, stat_type) VALUES(?,?)`
    let params = [statId, statType];

    db.run(sql, params, function(err) {
      if (err) {
        console.error(err.message);
        reject(err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
      resolve(this.lastID);
    });
  });
}


function getAllStatByStatType(statType) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM ${tableName} WHERE stat_type = ?`;
    let params = [statType];
    db.all(sql, params, function(err, rows) {
      if (err) {
        console.error(err.message);
        reject(err.message);
      }
      resolve(rows);
    });
  });
}

function getStatByStatType(statType) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM ${tableName} WHERE stat_type = ?`;
    let params = [statType];
    db.get(sql, params, function(err, row) {
      if (err) {
        console.error(err.message);
        reject(err.message);
      }

      if (row) resolve({ statId: row['stat_id'], statType: row['stat_type'], dbId: row['id'] });

      resolve(null);
    });
  });
}


module.exports = {
  createTable,
  deleteRow,
  insertRow,
  getStatByStatType,
  getAllStatByStatType,
};
