'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (threadID, amount, timestamp, callback) => {
  if (typeof timestamp === 'function') {
    callback = timestamp;
    timestamp = undefined;
  }
  return invoke(ctx, ctx.client.getThreadHistory, [threadID, amount, timestamp], callback);
};