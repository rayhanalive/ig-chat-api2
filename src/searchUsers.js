'use strict';
const { invoke, optionsCallback } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (query, options, callback) => {
  const parsed = optionsCallback(options, callback);
  return invoke(ctx, ctx.client.searchUsers, [query, parsed.options], parsed.callback);
};