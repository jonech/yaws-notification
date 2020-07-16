const cron = require('node-cron');
const wfstat = require('./src/wfstat');
const constant = require('./src/constant');
const fcm = require('./fcm');

// cron.schedule('* * * * *', async () => {
//   console.log('---------------------');
//   console.log('Running Cron Job');

//   console.log('Fetching WorldState...');
//   let worldState = await api.getWorldState();
//   console.log('Fetch WorldState complete');
//   if (worldState) {
//     await processCetusCycle(worldState.cetusCycle);
//   }
//   console.log('Cron Job complete...');
// });

async function processCetusCycle(newCetusCycle) {
  if (newCetusCycle && newCetusCycle.expiry) {
    let expiry = newCetusCycle.expiry;
    let timeLeft = expiry - Date.now();
    if (timeLeft <= 0) {
      return;
    }

    let oldCetusCycle = await wfstat.getStatByStatType(constant.WFStatType.CETUS_CYCLE);
    if (oldCetusCycle == null) {
      return;
    }
    if (oldCetusCycle.statId == newCetusCycle.id) {
      return;
    }

    await wfstat.deleteRow(oldCetusCycle.dbId);
    await wfstat.insertRow(newCetusCycle.id, constant.WFStatType.CETUS_CYCLE);

    fcm.send(`Cetus ${newCetusCycle.state}`, newCetusCycle.shortString, constant.WFPlatform.PC, constant.WFStatType.CETUS_CYCLE);
  }
}
