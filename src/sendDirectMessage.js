'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (userID, message, callback) =>
  clientMethod(ctx, 'sendDirectMessage', [userID, message], callback);