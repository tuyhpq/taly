'use strict';

/**
 * Module dependencies
 */
var config = require('../config/server.config'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Schema
 */
var AutosSchema = new Schema({
  title: {
    type: String
  },
  link: {
    type: String
  },
  describe: {
    type: String
  },
  urlImgs: [{
    name: String,
    url: String
  }],
  urlFiles: [{
    name: String,
    url: String,
    size: String
  }],
  created: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: String
  }
});

mongoose.model(config.names, AutosSchema);
