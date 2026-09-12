'use strict';
const { clientMethod, optionsAndCallback } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (threadID, url, options, callback) => {
  const normalized = optionsAndCallback(options, callback);
  return clientMethod(ctx, 'sendPhotoFromUrl', [threadID, url, normalized.options], normalized.callback);
};