'use strict';

/**
 * Small compatibility layer used by every FCA-style API function.
 * Core Instagram methods stay promise based, while callers may still use
 * the callback convention used by facebook-chat-api.
 */

function callbackify(value, callback) {
  if (typeof callback !== 'function') return value;

  Promise.resolve(value).then(
    result => callback(null, result),
    error => callback(error)
  );
  return value;
}

function invoke(ctx, method, args = [], callback) {
  try {
    const value = method.apply(ctx.client, args);
    return callbackify(value, callback);
  } catch (error) {
    if (typeof callback === 'function') {
      callback(error);
      return undefined;
    }
    throw error;
  }
}

function lastCallback(args) {
  const last = args[args.length - 1];
  return typeof last === 'function' ? last : null;
}

function optionsCallback(options, callback) {
  if (typeof options === 'function') {
    return { options: {}, callback: options };
  }
  return { options: options || {}, callback };
}

module.exports = { callbackify, invoke, lastCallback, optionsCallback };