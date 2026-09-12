'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (message, threadID, callback) =>
  invoke(ctx, ctx.client.sendMessage.toThread.bind(ctx.client.sendMessage), [threadID, message], callback);