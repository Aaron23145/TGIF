'use strict';

function genData() {
  return new Promise(function (resolve, reject) {
    requestData('house')
      .then(() => resolve())
      .catch(e => reject(e));
  })
}
