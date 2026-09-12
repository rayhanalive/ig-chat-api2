'use strict';
const { clientMethod, optionsAndCallback } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (threadID, path, options, callback) => {
  const normalized = optionsAndCallback(options, callback);
  return clientMethod(ctx, 'sendVoice', [threadID, path, normalized.options], normalized.callback);
};