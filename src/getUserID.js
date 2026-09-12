'use strict';
const { callbackify } = require('./api-helpers');
module.exports = (defaults, api, ctx) => (username, callback) => {
  try {
    const result = ctx.client.getUserInfoByUsername(username);
    const userID = Promise.resolve(result).then(user =>
      user && typeof user === 'object' ? (user.userID || user.userId) : user
    );
    return callbackify(userID, callback);
  } catch (error) {
    if (typeof callback === 'function') {
      callback(error);
      return undefined;
    }
    throw error;
  }
};