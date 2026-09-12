'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (threadID, read, callback) => {
  if (typeof read === 'function') {
    callback = read;
    read = true;
  }
  return clientMethod(ctx, 'markAsRead', [threadID, read === undefined ? true : read], callback);
};