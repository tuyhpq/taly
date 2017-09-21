'use strict';

/**
 * Module dependencies
 */
var config = require('../config/server.config'),
  path = require('path'),
  mongoose = require('mongoose'),
  Modules = mongoose.model(config.names),
  multer = require('multer'),
  configRoot = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create
 */
exports.create = function (req, res) {
  var modules = new Modules(req.body);
  if (req.user) {
    modules.created_by = req.user.displayName;
  }
  modules.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(modules);
    }
  });
};
