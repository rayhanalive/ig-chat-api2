'use strict';
const { callbackify } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (userID, callback) => {
  try {
    const result = Promise.resolve(ctx.client.getUserInfo(userID)).then(user => user && ({
      ...user,
      name: user.name || user.fullName || user.username,
      id: user.id || user.userID || user.userId
    }));
    return callbackify(result, callback);
  } catch (error) {
    if (typeof callback === 'function') {
      callback(error);
      return undefined;
    }
    throw error;
  }
};