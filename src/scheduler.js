const schedule = require('node-schedule');
const moment = require('moment');

const api = require('./api');
const constant = require('./constant');
const fcm = require('./fcm');

async function runCetusCycle(firstRun = false) {
  let now = moment();
  console.log('Cetus Cycle Run Start: ' + now.format('LLL'));
  console.log('Fetching Cetus Cycle...');
  let cetusCycle = await api.getCetusCycle();
  console.log('Fetch Cetus Cycle complete');
  if (cetusCycle) {
    await processCetusCycle(cetusCycle, now, firstRun);
  }
}

async function processCetusCycle(cetusCycle, currentTime, firstRun = false) {
  if (cetusCycle.expiry) {
    let expiry = moment(cetusCycle.expiry);
    console.log('Cetus Cycle Expiry: ' + expiry.format('LLL'));

    let timeLeft = expiry.diff(currentTime);
    if (timeLeft <= 0) {
      let reschedule = currentTime.add('15', s); // rerun after 15s
      console.log('Re-schedule Cetus Cycle on: ' + reschedule.format('LLL'));
      schedule.scheduleJob(reschedule.toDate(), runCetusCycle);
      return;
    }

    if (!firstRun) {
      fcm.send({
        title: `Cetus ${cetusCycle.state}`,
        body: cetusCycle.shortString,
        platform: constant.WFPlatform.PC,
        stat: constant.WFStatType.CETUS_CYCLE
      }).catch(err => console.error(err));
    }

    console.log('Schedule Cetus Cycle on: ' + expiry.format('LLL'));
    schedule.scheduleJob(expiry.toDate(), runCetusCycle);
  }
}


module.exports = {
  runCetusCycle
}