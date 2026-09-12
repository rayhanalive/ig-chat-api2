'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (name) =>
  clientMethod(ctx, 'stopTask', [name], null);