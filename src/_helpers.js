'use strict';

function callbackFrom(args) {
  if (typeof args[args.length - 1] === 'function') {
    return args.pop();
  }
  return null;
}

function optionsAndCallback(options, callback) {
  if (typeof options === 'function') {
    return { options: {}, callback: options };
  }
  return { options: options || {}, callback: callback || null };
}

function invoke(method, args, callback) {
  const promise = Promise.resolve().then(() => method(...args));
  if (callback) {
    promise.then(
      (value) => callback(null, value),
      (error) => callback(error)
    );
  }
  return promise;
}

function clientMethod(ctx, name, args, callback) {
  if (!ctx || !ctx.client || typeof ctx.client[name] !== 'function') {
    const error = new Error(`Instagram API method "${name}" is not available`);
    if (callback) callback(error);
    return Promise.reject(error);
  }
  return invoke(ctx.client[name].bind(ctx.client), args, callback);
}

module.exports = { callbackFrom, invoke, clientMethod, optionsAndCallback };