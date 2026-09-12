'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (broadcastID, count, callback) => {
  if (typeof count === 'function') {
    callback = count;
    count = 1;
  }
  return clientMethod(ctx, 'sendLiveHeart', [broadcastID, count === undefined ? 1 : count], callback);
};