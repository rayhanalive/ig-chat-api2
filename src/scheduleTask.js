'use strict';
const { clientMethod } = require('./_helpers');
module.exports = (_defaultFuncs, _api, ctx) => (name, cronExpression, task, options) =>
  clientMethod(ctx, 'scheduleTask', [name, cronExpression, task, options || {}], null);