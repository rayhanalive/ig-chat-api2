'use strict';
const { invoke, optionsCallback } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (threadID, url, options, callback) => {
  const parsed = optionsCallback(options, callback);
  return invoke(ctx, ctx.client.sendVoiceFromUrl, [threadID, url, parsed.options], parsed.callback);
};