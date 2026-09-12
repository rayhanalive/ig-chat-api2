'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (threadID, callback) =>
  invoke(ctx, ctx.client.unmuteThread, [threadID], callback);