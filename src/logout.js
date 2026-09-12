'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => callback =>
  invoke(ctx, ctx.client.logout, [], callback);