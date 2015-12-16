'use strict';

var Question = require('../models').model('Question');
var Answer = require('../models').model('Answer');

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
      Question.findById(req.params.id).exec()
        .then(function (question) {
          if (!question) {
            var err = new Error("Question doesn't exist");
            return next(err);
          }
          var q = question;
          Answer.find({questionID: req.params.id}).exec()
            .then(function (a) {
              var result = {"question": q, "answers": a};
              res.json(result);
            })
          ;
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

      Question.findById(req.params.id).exec()
        .then(function (question) {
          if (!question) {
            var err = new Error("Question does not exist");
            return next(err);
          }

          var body = req.body;
          body.userID = req.user._id.toString();
          body.questionID = req.params.id;
          body.username = req.user.userName;

          Answer.create(body)
            .then(function () {
              // this.byID.get(req, res, next);
              Question.findById(req.params.id).exec()
                .then(function (question) {
                  var q = question;
                  Answer.find({questionID: req.params.id}).exec()
                    .then(function (a) {
                      var result = {"question": q, "answers": a};
                      res.json(result);
                    })
                  ;
                })
              ;
            })
          ;
        })
        .catch(function (err) {
          return next(err);
        })
      ;
    },

    patch: function(req, res, next) {
      if (!req.user) {
        var err = new Error("Log in first");
        return next(err);
      }

      Question.findById(req.params.id).exec()
        .then(function (question) {
          if (!question) {
            var err = new Error("Question doesn't exist");
            return next(err);
          } else if (question.userID !== req.user._id.toString()) {
            var err = new Error("This Question doesn't belong to you");
            return next(err);
          }

          var body = req.body;
          body.userID = req.user._id.toString();
          body.username = req.user.userName;

          Question.update({_id: req.params.id}, body)
            .then(function () {
              Question.findById(req.params.id).exec()
                .then(function (question) {
                  res.json(question);
                })
              ;
            })
          ;
        })
        .catch(function (err) {
          return next(err);
        })
      ;
    },

    del: function(req, res, next) {
      if (!req.user) {
        var err = new Error("Log in first");
        return next(err);
      }

      Question.findById(req.params.id).exec()
        .then(function (question) {
          if (!question) {
            var err = new Error("Question doesn't exist");
            return next(err);
          } else if (question.userID !== req.user._id.toString()) {
            var err = new Error("This Question doesn't belong to you");
            return next(err);
          }
          Question.remove({_id: req.params.id})
            .then(function () {
              Answer.remove({questionID: req.params.id})
                .then(function () {
                  res.sendStatus(200);
                })
              ;
            })
          ;
        })
        .catch(function (err) {
          return next(err);
        })
      ;
    }
  }
};
