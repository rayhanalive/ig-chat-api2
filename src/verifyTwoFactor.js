'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (code, identifier, callback) =>
  clientMethod(ctx, 'verifyTwoFactor', [code, identifier], callback);