'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (storyID, userID, emoji, callback) =>
  clientMethod(ctx, 'reactToStory', [storyID, userID, emoji], callback);