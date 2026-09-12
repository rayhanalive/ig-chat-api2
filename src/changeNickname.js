'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (userID, threadID, nickname, callback) =>
  clientMethod(ctx, 'changeNickname', [userID, threadID, nickname], callback);