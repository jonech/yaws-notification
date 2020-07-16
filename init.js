const wfstat = require('./src/wfstat');
const api = require('./src/api');
const constant = require('./src/constant');


async function init() {
  await wfstat.createTable();

  try {
    let worldState = await api.getWorldState();
    if (worldState.cetusCycle) {
      let cetus = worldState.cetusCycle;
      await wfstat.insertRow(cetus.id, constant.WFStatType.CETUS_CYCLE);
  
      let rows = await wfstat.getStatByStatType(constant.WFStatType.CETUS_CYCLE);
      console.log(rows);
    }
  }
  catch (err) {
    console.error('Error: ' + err);
  }
}

init();