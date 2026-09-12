'use strict';
module.exports = (_defaultFuncs, _api, ctx) => (userID) => ctx.client.formatUserID(userID);