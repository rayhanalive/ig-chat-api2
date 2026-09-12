'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (reaction, messageID, callback) =>
  clientMethod(ctx, 'sendReaction', [reaction, messageID], callback);