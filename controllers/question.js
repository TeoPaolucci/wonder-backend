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
      Question.find().exec()
        .then(function (questions) {
          res.json(wrap('questions', questions));
        })
        .catch(function (err) {
          return next(err);
        })
      ;
    },

    post: function(req, res, next) {
      if (!req.user) {
        var err = new Error("Log in first");
        return next(err);
      }
      var body = req.body;
      body.userID = req.user._id.toString();
      body.username = req.user.userName;

      Question.create(body)
        .then(function (newQuestion) {
          res.json(newQuestion);
        })
        .catch(function (err) {
          return next(err);
        })
      ;
    }
  },

  user: {
    get: function(req, res, next) {
      if (!req.user) {
        var err = new Error("Log in first");
        return next(err);
      }
      Question.find({userID: req.user._id.toString()}).exec()
        .then(function (questions) {
          res.json(wrap('questions', questions));
        })
        .catch(function (err) {
          return next(err);
        })
      ;
    },

    getByID: function(req, res, next) {
      Question.find({userID: req.params.id}).exec()
        .then(function (questions) {
          res.json(wrap('questions', questions));
        })
        .catch(function (err) {
          return next(err);
        })
      ;
    }
  },

  byID: {
    get: function(req, res, next) {
      res.json({message: "Nuu... Stahp eet"});
    },

    post: function(req, res, next) {
      res.json({message: "Nuu... Stahp eet"});
    },

    patch: function(req, res, next) {
      res.json({message: "Nuu... Stahp eet"});
    },

    del: function(req, res, next) {
      res.json({message: "Nuu... Stahp eet"});
    }
  }
};
