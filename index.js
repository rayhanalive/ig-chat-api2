'use strict';

/**
 * IG-CHAT-API2
 *
 * Instagram transport with the public API shape of facebook-chat-api:
 *
 *   const login = require('./ig-chat-api2');
 *   const api = await login({ appState: cookies });
 *   api.listenMqtt((err, event) => {});
 *   api.sendMessage('hello', threadID);
 *
 * Promise and callback styles are supported by every request method.
 */

const InstagramChatAPI = require('./src/instagramChat');
const CookieUtils = require('./src/utils/cookies');
const { setOptions, getOptions } = require('./src/utils/setOptions');

const API_FUNCTIONS = [
  'getCurrentUserID',
  'listenMqtt',
  'stopListening',
  'sendMessage',
  'sendDirectMessage',
  'replyToMessage',
  'unsendMessage',
  'sendPhoto',
  'sendVideo',
  'sendVoice',
  'sendGIF',
  'sendPhotoFromUrl',
  'sendVideoFromUrl',
  'sendVoiceFromUrl',
  'setMessageReaction',
  'removeMessageReaction',
  'getThreadInfo',
  'getThreadList',
  'getThreadHistory',
  'searchForThread',
  'deleteThread',
  'muteThread',
  'unmuteThread',
  'setTitle',
  'changeNickname',
  'addUserToGroup',
  'removeUserFromGroup',
  'sendTypingIndicator',
  'markAsRead',
  'markAsReadAll',
  'getUserInfo',
  'getUserID',
  'searchUsers',
  'getHealth',
  'logout'
];

function loadApiFunctions(defaultFuncs, api, ctx) {
  for (const name of API_FUNCTIONS) {
    api[name] = require(`./src/${name}`)(defaultFuncs, api, ctx);
  }

  // Names commonly used by existing GoatBot/FCA scripts.
  api.listen = api.listenMqtt;
  api.on = (...args) => ctx.client.on(...args);
  api.off = (...args) => ctx.client.off(...args);
  api.once = (...args) => ctx.client.once(...args);
  api.sendReaction = api.setMessageReaction;
  api.removeReaction = api.removeMessageReaction;
  api.getInbox = api.getThreadList;
  api.searchThreads = api.searchForThread;
  api.changeThreadTitle = api.setTitle;
  api.getPendingRequests = (options, callback) => {
    const parsed = typeof options === 'function'
      ? { options: {}, callback: options }
      : { options: options || {}, callback };
    return ctx.client.getPendingRequests(parsed.options, parsed.callback);
  };
  api.approveRequest = (threadID, callback) =>
    ctx.client.approveRequest(threadID, callback);
  api.declineRequest = (threadID, callback) =>
    ctx.client.declineRequest(threadID, callback);
  api.stopTypingIndicator = (threadID, callback) =>
    ctx.client.stopTypingIndicator(threadID, callback);
  api.markAsUnread = (threadID, callback) =>
    ctx.client.markAsUnread(threadID, callback);
  api.searchReels = (query, options, callback) =>
    ctx.client.searchReels(query, options, callback);
  api.getUserStories = (userID, callback) =>
    ctx.client.stories.getUserStories(userID, callback);
  api.getFeedStories = (options, callback) =>
    ctx.client.stories.getFeedStories(options, callback);
  api.reactToStory = (storyID, userID, emoji, callback) =>
    ctx.client.stories.react(storyID, userID, emoji, callback);
  api.replyToStory = (storyID, userID, message, callback) =>
    ctx.client.stories.reply(storyID, userID, message, callback);
  api.getLiveFeed = (options, callback) =>
    ctx.client.live.getLiveFeed(options, callback);
  api.sendLiveComment = (broadcastID, message, callback) =>
    ctx.client.live.sendComment(broadcastID, message, callback);
  api.sendLiveHeart = (broadcastID, count, callback) =>
    ctx.client.live.sendHeart(broadcastID, count, callback);
  api.searchHashtags = (query, options, callback) =>
    ctx.client.search.hashtags(query, options, callback);
  api.searchPlaces = (query, options, callback) =>
    ctx.client.search.places(query, options, callback);
  api.getSession = () => ctx.client.serialize();
  api.serialize = () => ctx.client.serialize();
  api.deserialize = state => ctx.client.deserialize(state);
  api.loadSession = state => ctx.client.deserialize(state);
  api.initDatabase = () => ctx.client.initDatabase();
  api.scheduleTask = (name, cronExpression, task, options) =>
    ctx.client.scheduleTask(name, cronExpression, task, options);
  api.stopTask = name => ctx.client.stopTask(name);
  api.destroy = () => ctx.client.destroy();

  return api;
}

function buildAPI(client) {
  const ctx = {
    client,
    loggedIn: true,
    userID: client.getCurrentUserID()?.userId || null
  };

  const defaultFuncs = {
    get: (...args) => client.http.get.bind(client.http)(...args),
    post: (...args) => client.http.post.bind(client.http)(...args),
    postForm: (...args) => client.http.postForm.bind(client.http)(...args)
  };

  const api = {
    setOptions,
    getOptions,
    getAppState: () => CookieUtils.toJSON(client.http.jar),
    getSession: () => client.serialize(),
    CookieUtils,
    _client: client,
    _ctx: ctx
  };

  return loadApiFunctions(defaultFuncs, api, ctx);
}

function normalizeCredentials(credentials) {
  if (credentials && typeof credentials === 'object') {
    // FCA-compatible login({ appState: [...] })
    if (credentials.appState !== undefined) return credentials.appState;
    if (credentials.cookies !== undefined) return credentials.cookies;
  }
  return credentials;
}

async function loginInternal(credentials, options = {}) {
  const client = new InstagramChatAPI(options);
  const normalized = normalizeCredentials(credentials);

  const isCookies =
    typeof normalized === 'string' ||
    Array.isArray(normalized) ||
    (normalized && typeof normalized === 'object' && !normalized.password);

  if (isCookies) {
    const result = await client.loginWithCookies(normalized);
    if (!result || result.success === false) {
      throw new Error(result?.error || 'Instagram cookie login failed');
    }
  } else {
    if (!normalized || typeof normalized !== 'object') {
      throw new TypeError(
        'Login requires cookies or { username/email, password } credentials'
      );
    }

    const username = normalized.username || normalized.email;
    const result = await client.login(username, normalized.password);

    if (result?.twoFactorRequired) {
      const error = new Error('Two-factor authentication required');
      error.twoFactorRequired = true;
      error.twoFactorIdentifier = result.twoFactorIdentifier;
      error.verify = code =>
        client.verifyTwoFactor(code, result.twoFactorIdentifier);
      throw error;
    }
  }

  return buildAPI(client);
}

function login(credentials, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  const promise = loginInternal(credentials, options || {});
  if (typeof callback === 'function') {
    promise.then(api => callback(null, api)).catch(error => callback(error));
    return;
  }
  return promise;
}

login.CookieUtils = CookieUtils;
login.setOptions = setOptions;
login.getOptions = getOptions;
login.createClient = options => new InstagramChatAPI(options);
login.login = login;

module.exports = login;