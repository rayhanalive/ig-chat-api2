'use strict';
const { callbackify } = require('./api-helpers');
module.exports = (defaults, api, ctx) => callback => {
  try {
    const result = ctx.client.getCurrentUserID();
    const rawUserID = result && typeof result === 'object'
      ? (result.userId || result.userID)
      : result;
    // Keep FCA's string-like behaviour while retaining the `.userID` field
    // used by older ICA-based GoatBot code.
    const userID = rawUserID == null ? rawUserID : new String(rawUserID);
    if (userID != null) {
      userID.userID = userID.toString();
      userID.userId = userID.toString();
    }
    return callbackify(userID, callback);
  } catch (error) {
    if (typeof callback === 'function') {
      callback(error);
      return undefined;
    }
    throw error;
  }
};