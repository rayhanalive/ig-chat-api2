'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (threadIDs, callback) =>
  invoke(ctx, ctx.client.markRead.markMultipleAsRead.bind(ctx.client.markRead), [threadIDs], callback);