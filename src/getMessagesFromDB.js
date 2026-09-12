'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (threadID, options, callback) => {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  return clientMethod(ctx, 'getMessagesFromDB', [threadID, options || {}], callback);
};