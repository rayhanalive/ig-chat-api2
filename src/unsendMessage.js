'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (messageID, callback) =>
  clientMethod(ctx, 'unsendMessage', [messageID], callback);