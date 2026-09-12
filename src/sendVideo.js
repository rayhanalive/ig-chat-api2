'use strict';
const { invoke, optionsCallback } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (threadID, path, options, callback) => {
  const parsed = optionsCallback(options, callback);
  return invoke(ctx, ctx.client.sendVideo, [threadID, path, parsed.options], parsed.callback);
};