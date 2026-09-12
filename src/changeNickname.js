'use strict';
const { invoke } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (nickname, threadID, participantID, callback) =>
  invoke(ctx, ctx.client.changeNickname, [participantID, threadID, nickname], callback);