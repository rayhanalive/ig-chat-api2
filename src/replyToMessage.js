'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (threadID, message, replyToMessageID, callback) =>
  clientMethod(ctx, 'replyToMessage', [threadID, message, replyToMessageID], callback);