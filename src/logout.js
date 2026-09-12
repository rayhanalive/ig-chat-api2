'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (callback) =>
  clientMethod(ctx, 'logout', [], callback);