'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (threadID, read = true, callback) => {
  if (typeof read === 'function') {
    callback = read;
    read = true;
  }
  return invoke(ctx, ctx.client.markAsRead, [threadID, read], callback);
};