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

/**
 * Show
 */
exports.read = function (req, res) {
  // Convert mongoose document to JSON
  var modules = req.modules ? req.modules.toJSON() : {};

  res.json(modules);
};

/**
 * Update
 */
exports.update = function (req, res) {
  var modules = req.modules;

  modules.title = req.body.title;
  modules.author = req.body.author;

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

/**
 * Delete
 */
exports.delete = function (req, res) {
  var modules = req.modules;

  modules.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(modules);
    }
  });
};

/**
 * List
 */
exports.list = function (req, res) {
  Modules.find().sort('-created').exec(function (err, modules) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(modules);
    }
  });
};

/**
 * Params
 */
exports.byID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: config.names.toUpperCase() + ' is invalid'
    });
  }

  Modules.findById(id).exec(function (err, modules) {
    if (err) {
      return next(err);
    } else if (!modules) {
      return res.status(404).send({
        message: 'No ' + config.names.toUpperCase() + ' with that identifier has been found'
      });
    }
    req.modules = modules;
    next();
  });
};

/**
 * Upload image
 */
exports.uploadsPicture = function (req, res) {
  var multerConfig = configRoot.uploads.upload.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newImage');

  uploadImage()
    .then(function () {
      res.json({ nameFile: configRoot.uploads.upload.image.dest + req.file.filename });
    })
    .catch(function (err) {
      res.status(422).send(err);
    });

  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * Upload file
 */
exports.uploadsFile = function (req, res) {
  var multerConfig = configRoot.uploads.upload.file;
  var upload = multer(multerConfig).single('newFile');

  uploadFile()
    .then(function () {
      res.json({ nameFile: configRoot.uploads.upload.file.dest + req.file.filename });
    })
    .catch(function (err) {
      res.status(422).send(err);
    });

  function uploadFile() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * Check activation code from req.query.code
 */
exports.checkCode = function (req, res) {
  var code = req.query.code;
};

/**
 * Get the information of auto application
 */
exports.information = function (req, res) {
  var info = {
    'author': 'Tuý Công Tử - 0164.840.3817',
    'urlRecord': 'http://taly.waplux.com/files/873730/records.txt',
    'urlFile': 'http://taly.waplux.com/files/873730/c9d0c9be297c47c9954197ecb04d5efe.txt',
    'pass1': '6875845034401',
    'pass3': '6875845034403',
    'pass5': '6875845034405',
    'pass7': '6875845034407',
    'pass': '687584503440vv',
    'passCustom': '687584503440',
    'stop': 'false'
  };
  return res.send(info);
};