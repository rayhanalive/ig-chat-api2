'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (threadID, title, callback) =>
  clientMethod(ctx, 'changeThreadTitle', [threadID, title], callback);