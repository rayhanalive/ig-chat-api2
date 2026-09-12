'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const login = require('../index');

const publicFunctions = [
  'getCurrentUserID', 'listen', 'listenMqtt', 'stopListening',
  'sendMessage', 'sendDirectMessage', 'replyToMessage', 'unsendMessage',
  'sendPhoto', 'sendVideo', 'sendVoice', 'sendGIF',
  'sendPhotoFromUrl', 'sendVideoFromUrl', 'sendVoiceFromUrl',
  'sendReaction', 'setMessageReaction', 'removeReaction',
  'getThreadInfo', 'getThreadHistory', 'getInbox', 'getThreadList',
  'getPendingRequests', 'searchThreads', 'deleteThread', 'muteThread',
  'unmuteThread', 'changeThreadTitle', 'setTitle', 'changeNickname',
  'sendTypingIndicator', 'stopTypingIndicator', 'markAsRead', 'markAsSeen',
  'markAsUnread', 'getUserInfo', 'getUserInfoByUsername', 'searchUsers',
  'searchReels', 'getUserStories', 'getFeedStories', 'reactToStory',
  'replyToStory', 'getLiveFeed', 'sendLiveComment', 'sendLiveHeart',
  'searchHashtags', 'searchPlaces', 'getHealth', 'getSession', 'loadSession',
  'logout', 'verifyTwoFactor', 'initDatabase', 'saveMessageToDB',
  'getMessagesFromDB', 'scheduleTask', 'stopTask', 'formatThreadID',
  'formatUserID'
];

assert.strictEqual(typeof login, 'function');
assert.strictEqual(login.login, login);
assert.strictEqual(typeof login.createClient, 'function');

for (const name of publicFunctions) {
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'src', `${name}.js`)), `${name}.js is missing`);
}

async function main() {
  const client = login.createClient({ logLevel: 'silent' });
  client.auth.isAuthenticated = () => true;
  client.getCurrentUserID = () => ({ userId: '1001' });
  client.sendMessage.toThread = async (threadID, message) => ({ threadID, message });
  client.replyToMessage = async (threadID, message, messageID) => ({ threadID, message, messageID });

  const api = login.buildAPI(client, { logLevel: 'silent' });
  assert.strictEqual(typeof api.sendMessage, 'function');
  assert.strictEqual(typeof api.listenMqtt, 'function');
  assert.deepStrictEqual(
    await api.sendMessage('hello', 'thread-1'),
    { threadID: 'thread-1', message: 'hello' }
  );
  assert.deepStrictEqual(
    await api.sendMessage('reply', 'thread-1', undefined, 'message-1'),
    { threadID: 'thread-1', message: 'reply', messageID: 'message-1' }
  );

  let callbackResult;
  await api.sendMessage('callback', 'thread-2', (error, result) => {
    callbackResult = { error, result };
  });
  assert.strictEqual(callbackResult.error, null);
  assert.deepStrictEqual(callbackResult.result, { threadID: 'thread-2', message: 'callback' });

  await client.destroy().catch(() => {});
  console.log(`ig-chat-api2 contract check passed (${publicFunctions.length} public functions)`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});