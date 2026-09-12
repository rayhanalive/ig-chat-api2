'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (threadID, amount, timestamp, callback) =>
  clientMethod(ctx, 'getThreadHistory', [threadID, amount, timestamp], callback);