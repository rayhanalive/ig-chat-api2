'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (message, callback) =>
  clientMethod(ctx, 'saveMessageToDB', [message], callback);