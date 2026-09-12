'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (storyID, userID, message, callback) =>
  clientMethod(ctx, 'replyToStory', [storyID, userID, message], callback);