'use strict';

/**
 * Module dependencies
 */
var config = require('../config/server.config');
var modules = require('../controllers/' + config.names + '.server.controller');

module.exports = function (app) {

  // Collection routes
  app.route(config.route)
    .get(modules.list)
    .post(modules.create);

  // Single routes
  app.route(config.route + '/:' + config.param)
    .get(modules.read)
    .put(modules.update)
    .delete(modules.delete);

  // Upload images
  app.route('/api/uploads/picture')
    .post(modules.uploadsPicture);

  // Upload files
  app.route('/api/uploads/file')
    .post(modules.uploadsFile);

  // Check activation code from req.query.code
  app.route('/api/checks/activate')
    .get(modules.checkCode);

    // Information of auto application
  app.route('/api/auto/info')
  .get(modules.information);

  // Finish by binding module middleware
  app.param(config.param, modules.byID);
};
