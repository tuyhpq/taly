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
  X: {
    type: Number,
    min: 0,
    required: true
  },
  Y: {
    type: Number,
    min: 0,
    required: true
  },
  start: {
    type: Number,
    min: 0,
    required: true
  },
  end: {
    type: Number,
    min: 0,
    required: true
  },
  time: {
    type: Number,
    min: 0,
    required: true
  },
  isMove: {
    type: Boolean,
    required: true
  },
  move: {
    X: {
      type: Number,
      min: 0,
      required: true
    },
    Y: {
      type: Number,
      min: 0,
      required: true
    },
    before: {
      type: Number,
      min: 1,
      required: true
    }
  },
  touchs: [{
    X: {
      type: Number,
      min: 0,
      required: true
    },
    Y: {
      type: Number,
      min: 0,
      required: true
    },
    before: {
      type: Number,
      min: 1,
      required: true
    },
    time: {
      type: Number,
      min: 1,
      required: true
    }
  }]
});

mongoose.model(config.names, AutosSchema);
