'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (state, callback) =>
  clientMethod(ctx, 'deserialize', [state], callback);