'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
  userID: {
    type: String,
    required: true
  },
  questionID: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  // choice: String,
  description: String
});

moduel.exports = answerSchema;
