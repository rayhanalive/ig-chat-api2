'use strict';
module.exports = (defaults, api, ctx) => callback => {
  const result = ctx.client.stopListening();
  if (typeof callback === 'function') callback(null, result);
  return result;
};