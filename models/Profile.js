'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
  userID: {
    type: String,
    required: true
  },
  username: String,
  first_name: String,
  last_name: String,
  dob: String,
  email: String,
  trustedIDs: Array
});

module.exports = profileSchema;
