'use strict';
module.exports = (_defaultFuncs, _api, ctx) => (threadID) => ctx.client.formatThreadID(threadID);