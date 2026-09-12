'use strict';

/**
 * ig-chat-api2
 *
 * The public surface intentionally follows the function registry used by
 * fca: every API operation lives in src/<function>.js and receives the same
 * (defaultFuncs, api, ctx) factory arguments.
 *
 * Instagram still uses its own HTTP and MQTT protocol implementation; this
 * layer only makes the public API predictable for GoatBot-style projects.
 */

const InstagramChatAPI = require('./src/instagramChat');
const CookieUtils = require('./src/utils/cookies');
const optionsManager = require('./src/utils/setOptions');

const FUNCTION_NAMES = [
  'getCurrentUserID',
  'listen',
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
  'sendReaction',
  'setMessageReaction',
  'removeReaction',
  'getThreadInfo',
  'getThreadHistory',
  'getInbox',
  'getThreadList',
  'getPendingRequests',
  'searchThreads',
  'deleteThread',
  'muteThread',
  'unmuteThread',
  'changeThreadTitle',
  'setTitle',
  'changeNickname',
  'sendTypingIndicator',
  'stopTypingIndicator',
  'markAsRead',
  'markAsSeen',
  'markAsUnread',
  'getUserInfo',
  'getUserInfoByUsername',
  'searchUsers',
  'searchReels',
  'getUserStories',
  'getFeedStories',
  'reactToStory',
  'replyToStory',
  'getLiveFeed',
  'sendLiveComment',
  'sendLiveHeart',
  'searchHashtags',
  'searchPlaces',
  'getHealth',
  'getSession',
  'loadSession',
  'logout',
  'verifyTwoFactor',
  'initDatabase',
  'saveMessageToDB',
  'getMessagesFromDB',
  'scheduleTask',
  'stopTask',
  'formatThreadID',
  'formatUserID'
];

function createDefaultFuncs(client) {
  return {
    get: (...args) => client.http.get(...args),
    post: (...args) => client.http.post(...args),
    postFormData: (...args) => client.http.postFormData
      ? client.http.postFormData(...args)
      : client.http.postForm(...args),
    postForm: (...args) => client.http.postForm(...args)
  };
}

function buildAPI(client, options) {
  const globalOptions = optionsManager.setOptions(options);
  const ctx = {
    client,
    jar: client.http.jar,
    globalOptions,
    userID: client.userId || null,
    loggedIn: client.auth.isAuthenticated(),
    defaultFuncs: null
  };
  const defaultFuncs = createDefaultFuncs(client);
  ctx.defaultFuncs = defaultFuncs;

  const api = {
    setOptions(nextOptions = {}) {
      const merged = optionsManager.setOptions(nextOptions);
      optionsManager.applyOptions(client, merged);
      ctx.globalOptions = merged;
      return merged;
    },
    getAppState() {
      return client.http.jar.serializeSync().cookies;
    },
    getApiVersion() {
      return 'ig-chat-api2/1.0.0';
    },
    CookieUtils,
    _client: client,
    _ctx: ctx
  };

  for (const name of FUNCTION_NAMES) {
    api[name] = require(`./src/${name}`)(defaultFuncs, api, ctx);
  }

  return api;
}

async function loginInternal(credentials, options = {}) {
  const client = new InstagramChatAPI(options);
  const isCookieLogin =
    typeof credentials === 'string' ||
    Array.isArray(credentials) ||
    (credentials && typeof credentials === 'object' && !credentials.password);

  let result;
  if (isCookieLogin) {
    result = await client.loginWithCookies(credentials, options);
  } else {
    if (!credentials || typeof credentials !== 'object') {
      throw new TypeError('Login data must be cookies or an object with username and password');
    }
    result = await client.login(
      credentials.username || credentials.email,
      credentials.password
    );
  }

  if (!result || !result.success) {
    const error = new Error(result?.error || 'Instagram login failed');
    if (result?.twoFactorRequired) {
      error.twoFactorRequired = true;
      error.twoFactorIdentifier = result.twoFactorIdentifier;
      error.verify = (code) => client.verifyTwoFactor(code, result.twoFactorIdentifier);
    }
    throw error;
  }

  return buildAPI(client, options);
}

function login(credentials, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  const promise = loginInternal(credentials, options || {});
  if (typeof callback === 'function') {
    promise.then((api) => callback(null, api)).catch((error) => callback(error));
  }
  return promise;
}

login.CookieUtils = CookieUtils;
login.setOptions = optionsManager.setOptions;
login.getOptions = optionsManager.getOptions;
login.createClient = (options) => new InstagramChatAPI(options);
login.buildAPI = buildAPI;
login.login = login;

module.exports = login;