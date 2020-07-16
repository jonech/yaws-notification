const https = require('https');

const worldState = {
  host: 'api.warframestat.us',
  path: '/pc',
  method: 'GET'
};

const cetusCycle = {
  host: 'api.warframestat.us',
  path: '/pc/cetusCycle',
  method: 'GET'
}

function makeRequest(requestOptions) {
  // create a new Promise
  return new Promise((resolve, reject) => {
    https.request(requestOptions, res => onResponse(res, resolve, reject))
            .on('error', reject)
            .end();

    /* if there's an error, then reject the Promise
        * (can be handled with Promise.prototype.catch) */
    //   request.on('error', err => reject(err));
    //   request.end();
  });
}
function onResponse(response, resolve, reject) {
  let responseBody = '';
  response.on('data', chunk => {
    responseBody += chunk.toString()
  });

  // once all the data has been read, resolve the Promise 
  response.on('end', () => resolve(JSON.parse(responseBody)));
}

module.exports = {

  getWorldState() {
    return makeRequest(worldState);
  },
  getCetusCycle() {
    return makeRequest(cetusCycle);
  }

};