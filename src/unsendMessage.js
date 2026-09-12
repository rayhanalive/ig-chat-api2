'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (messageID, callback) =>
  invoke(ctx, ctx.client.unsendMessage, [messageID], callback);