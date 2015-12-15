'use strict';

var Question = require('../models').model('Question');
// var Answer = require('../models').model('Answer');

var wrap = function wrap(root, formData) {
    var wrapper = {};
    wrapper[root] = formData;
    return wrapper;
};

module.exports = {
  root: {
    get: function(req, res, next) {
      //
    },
    post: function(req, res, next) {
      //
    }
  },
  user: {
    get: function(req, res, next) {
      //
    },
    getByID: function(req, res, next) {
      //
    }
  },
  byID: {
    get: function(req, res, next) {
      //
    },
    post: function(req, res, next) {
      //
    },
    patch: function(req, res, next) {
      //
    },
    del: function(req, res, next) {
      //
    }
  }
};
