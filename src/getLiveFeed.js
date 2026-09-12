'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (options, callback) => {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  return clientMethod(ctx, 'getLiveFeed', [options || {}], callback);
};