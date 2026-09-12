'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (reaction, messageID, callback) =>
  invoke(ctx, ctx.client.sendReaction, [reaction, messageID], callback);