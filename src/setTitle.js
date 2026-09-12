'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (title, threadID, callback) =>
  invoke(ctx, ctx.client.changeThreadTitle, [threadID, title], callback);