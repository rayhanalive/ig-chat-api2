'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (userID, message, callback) =>
  invoke(ctx, ctx.client.sendDirectMessage, [userID, message], callback);