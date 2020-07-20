const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
//const fs = require('fs');
const scheduler = require('./src/scheduler');


var port = process.env.PORT;
const app = express();
var sendOnFirstRun = process.env.NODE_ENV === 'production' ? true : false;

// app.get('/ping', async(req, res) => {
//   let worldState = await api.getWorldState();
//   if (worldState.cetusCycle && worldState.cetusCycle.expiry) {
//     let newCetusCycle = worldState.cetusCycle;
//     let expiry = newCetusCycle.expiry;
//     let timeLeft = expiry - Date.now();
//     if (timeLeft <= 0) {
//       res.send({oldstuff: newCetusCycle});
//       return;
//     }

//     let oldCetusCycle = await wfstat.getStatByStatType(constant.WFStatType.CETUS_CYCLE);
//     if (oldCetusCycle == null) {
//       res.send({oldstuff: oldCetusCycle});
//       return;
//     }
//     if (oldCetusCycle.statId == newCetusCycle.id) {
//       res.send({oldstuff: oldCetusCycle});
//       return;
//     }

//     await wfstat.deleteRow(oldCetusCycle.dbId);
//     await wfstat.insertRow(newCetusCycle.id, constant.WFStatType.CETUS_CYCLE);

//     fcm.send(`Cetus ${newCetusCycle.state}`, newCetusCycle.shortString, constant.WFPlatform.PC, constant.WFStatType.CETUS_CYCLE);
//     res.send({newstuff: newCetusCycle});
//   }

// });



app.get('/ping', async (req, res) => {
  res.send({result: 'OK'});
})

scheduler.runCetusCycle(sendOnFirstRun);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));



