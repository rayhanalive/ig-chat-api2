'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (userID, callback) =>
  clientMethod(ctx, 'getUserInfo', [userID], callback);