'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
  userID: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  // choices: Array,
  description: String,
  answered: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = questionSchema;
