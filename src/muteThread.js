'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (threadID, callback) =>
  clientMethod(ctx, 'muteThread', [threadID], callback);