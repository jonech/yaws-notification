const sqlite3 = require('sqlite3');
const dotenv = require('dotenv');
dotenv.config();


const db = new sqlite3.Database(process.env.PC_DATABASE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

// ref: https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
function exitHandler(options, exitCode) {
  if (options.cleanup) {
    // console.log('Closing DB...');
    // db.close((err) => {
    //   if (err) {
    //     console.error(err.message);
    //   }
    //   console.log('DB connection closed');
    // });
  }
  if (exitCode || exitCode === 0) console.log('ExitCode: '+ exitCode);
  if (options.exit) {
    console.log('Process exit');
    process.exit();
  }
}


module.exports = db;

