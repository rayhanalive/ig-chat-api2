'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (threadID, message, replyToMessageID, callback) =>
  invoke(ctx, ctx.client.replyToMessage, [threadID, message, replyToMessageID], callback);