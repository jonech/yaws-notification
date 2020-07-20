const schedule = require('node-schedule');
const moment = require('moment');

const api = require('./api');
const constant = require('./constant');
const fcm = require('./fcm');

async function runCetusCycle(skipFCM = false) {
  let now = moment();
  console.log('Cetus Cycle Run Start: ' + now.format('LLL'));
  console.log('Fetching Cetus Cycle...');
  let cetusCycle = await api.getCetusCycle();
  console.log('Fetch Cetus Cycle complete');
  if (cetusCycle) {
    let nextDate = processStat({
      current: now,
      expiry: cetusCycle.expiry ? moment(cetusCycle.expiry) : moment(new Date()),
      skipFCM: skipFCM,
      notification: {
        title: `Cetus ${cetusCycle.state}`,
        body: cetusCycle.shortString,
        platform: constant.WFPlatform.PC,
        stat: constant.WFStatType.CETUS_CYCLE
      }
    });

    schedule.scheduleJob(nextDate, runCetusCycle);
  }
}


function processStat(options) {
  let current = (options.current) ? options.current : moment();
  let expiry = (options.expiry) ? options.expiry : moment();

  console.log('Cetus Cycle Expiry: ' + expiry.format('LLL'));

  let timeLeft = expiry.diff(current);
  if (timeLeft <= 0) {
    let reschedule = current.add(15, 's'); // rerun after 15s
    console.log('Re-schedule Cetus Cycle on: ' + reschedule.format('LLL'));
    return reschedule.toDate();
  }

  if (!options.skipFCM) {
    fcm.send(options.notification).catch(err => console.error(err));
  }

  console.log('Schedule Cetus Cycle on: ' + expiry.format('LLL'));
  return expiry.toDate();
}

module.exports = {
  runCetusCycle
}