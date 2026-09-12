'use strict';
const { callbackify } = require('./api-helpers');

function toFcaThreadInfo(info) {
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

module.exports = (defaults, api, ctx) => (limit, timestamp, tags, callback) => {
  // Also accept the native ICA form: getThreadList({ limit, cursor, folder }, cb)
  let options;
  if (limit && typeof limit === 'object') {
    callback = typeof timestamp === 'function' ? timestamp : callback;
    options = limit;
  } else {
    if (typeof timestamp === 'function') {
      callback = timestamp;
      timestamp = undefined;
    }
    if (typeof tags === 'function') {
      callback = tags;
      tags = undefined;
    }
    options = {
      limit: limit || 20,
      cursor: timestamp,
      folder: tags
    };
  }

  try {
    const result = Promise.resolve(ctx.client.getInbox(options))
      .then(inbox => (inbox?.threads || []).map(toFcaThreadInfo));
    return callbackify(result, callback);
  } catch (error) {
    if (typeof callback === 'function') {
      callback(error);
      return undefined;
    }
    throw error;
  }
};