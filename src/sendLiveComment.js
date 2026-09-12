'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (broadcastID, message, callback) =>
  clientMethod(ctx, 'sendLiveComment', [broadcastID, message], callback);