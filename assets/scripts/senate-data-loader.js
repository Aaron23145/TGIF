'use strict';

function genData() {
  return new Promise(function (resolve, reject) {
    requestData('senate')
      .then(() => resolve())
      .catch(e => reject(e));
  })
}
