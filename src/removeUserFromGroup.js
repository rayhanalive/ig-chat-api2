'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (userID, threadID, callback) =>
  invoke(ctx, ctx.client.removeUserFromGroup, [userID, threadID], callback);