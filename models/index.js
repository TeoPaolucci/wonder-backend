'use strict';

process.env.MONGODB_URI || require('dotenv').load();
var mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.model('User', require('./User'));
mongoose.model('Profile', require('./Profile'));

mongoose.connect(process.env.MONGODB_URI);

module.exports = mongoose;
