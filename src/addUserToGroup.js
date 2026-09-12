'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (userID, threadID, callback) =>
  invoke(ctx, ctx.client.threadManagement.addUsers.bind(ctx.client.threadManagement), [threadID, userID], callback);