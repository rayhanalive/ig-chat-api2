'use strict';
const { invoke, clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (message, threadID, callback, replyToMessage) => {
  if (typeof callback === 'string' && replyToMessage === undefined) {
    replyToMessage = callback;
    callback = null;
  }
  if (replyToMessage !== undefined) {
    return clientMethod(ctx, 'replyToMessage', [threadID, message, replyToMessage], callback || null);
  }
  if (!ctx.client.sendMessage || typeof ctx.client.sendMessage.toThread !== 'function') {
    const error = new Error('Instagram sendMessage transport is not available');
    if (callback) callback(error);
    return Promise.reject(error);
  }
  return invoke(
    ctx.client.sendMessage.toThread.bind(ctx.client.sendMessage),
    [threadID, message],
    callback || null
  );
};