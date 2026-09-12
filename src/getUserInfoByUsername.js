'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (username, callback) =>
  clientMethod(ctx, 'getUserInfoByUsername', [username], callback);