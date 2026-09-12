'use strict';
const { callbackify } = require('./api-helpers');

function toFcaThreadInfo(info) {
  if (!info) return info;
  const participants = info.participantIDs
    || info.participants
    || info.users?.map(user => (user.pk || user.pk_id || user.id)?.toString()).filter(Boolean)
    || [];
  return {
    ...info,
    threadID: info.threadID || info.thread_id?.toString(),
    threadName: info.threadName || info.name || info.thread_title || '',
    participantIDs: participants,
    adminIDs: info.adminIDs || [],
    userInfo: info.userInfo || []
  };
}

module.exports = (defaults, api, ctx) => (threadID, callback) => {
  try {
    const result = Promise.resolve(ctx.client.getThreadInfo(threadID))
      .then(toFcaThreadInfo);
    return callbackify(result, callback);
  } catch (error) {
    if (typeof callback === 'function') {
      callback(error);
      return undefined;
    }
    throw error;
  }
};