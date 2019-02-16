'use strict';

function requestData(type) {
  return new Promise(function (resolve, reject) {
    fetch(`https://api.propublica.org/congress/v1/113/${type}/members.json`, {
      method: 'GET',
      headers: new Headers({
        'X-API-Key': 'lzTpp2Tp0OljdhcRJyXqEp3Bj9zMmHNnwRWtiovc',
      }),
      mode: 'cors',
    }).then(function (response) {
      if (response.status !== 200) {
        throw new Error(`An error has ocurred while trying to fetch data from propublica: 404`);
      }

      response.json().then(function (responseData) {
        window.data = responseData;
        resolve();
      });
    }).catch(function (error) {
      reject(error);
    });
  });
}
