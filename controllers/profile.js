'use strict';

var Profile = require('../models').model('Profile');

var wrap = function wrap(root, formData) {
    var wrapper = {};
    wrapper[root] = formData;
    return wrapper;
};

module.exports = {
  root: {
    get: function (req, res, next) {
      if(!req.user) {
        var err = new Error("Log in first");
        return next(err);
      }
      Profile.findOne({userID: req.user._id.toString()}).exec()
        .then(function (profile) {
          if(!profile) {
            var err = new Error("No Profile found");
            return next(err);
          }
          res.json(profile);
        })
        .catch(function (err) {
          return next(err);
        })
      ;
    },

    post: function (req, res, next) {
      if(!req.user) {
        var err = new Error("Log in first");
        return next(err);
      }
      Profile.findOne({userID: req.user._id.toString()}).exec()
        .then(function (profile) {
          // check if profile already exists
          if(profile) {
            var err = new Error("Profile already exists");
            return next(err);
          }
          // construct an object based on the body of the request
          // overwrite any bogus userID or username
          var body = req.body;
          body.userID = req.user._id.toString();
          body.username = req.user.userName;
          // create a new profile with that object
          Profile.create(body)
            .then(function (newProfile) {
              res.json(newProfile);
            })
          ;
        })
        .catch(function (err) {
          return next(err);
        })
      ;
    },

    patch: function (req, res, next) {
      if(!req.user) {
        var err = new Error("Log in first");
        return next(err);
      }

      Profile.findOne({userID: req.user._id.toString()}).exec()
        .then(function (profile) {
          if(!profile) {
            var err = new Error("Profile not created yet");
            return next(err);
          }

          var body = req.body;
          body.userID = req.user._id.toString();
          body.username = req.user.userName;

          Profile.update({userID: req.user._id.toString()}, body)
            .then(function() {
              Profile.findOne({userID: req.user._id.toString()}).exec()
                .then(function (newProfile) {
                  res.json(newProfile);
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
  },

  byID: {
    get: function (req, res, next) {
      Profile.findOne({userID: req.params.id}).exec()
        .then(function (profile) {
          if(!profile) {
            var err = new Error("Profile not created yet");
            return next(err);
          }
          res.json(profile);
        })
        .catch(function (err) {
          return next(err);
        })
      ;
    }
  },

  trust: {
    get: function(req, res, next) {
      if(!req.user) {
        var err = new Error("Log in first");
        return next(err);
      }

      Profile.findOne({userID: req.user._id.toString()}).exec()
        .then(function (profile) {
          if(!profile) {
            var err = new Error("Profile not created yet");
            return next(err);
          }

          var trustedIDList = profile.trustedIDs;
          if(!trustedIDList[0]) {
            res.json({message: "No trusted users"});
          }
          Profile.find({userID: {$in: trustedIDList}}).exec()
            .then(function (profiles) {
              res.json(wrap('profiles', profiles));
            })
          ;
        })
        .catch(function (err) {
          return next(err);
        })
      ;
    },

    post: function(req, res, next) {
      // if not logged in or provided id is the same as the logged in user's id, or no id provided throws an error.
      if(!req.user) {
        var err = new Error("Log in first");
        return next(err);
      } else if (!req.body.id) {
        var err = new Error("No ID provided");
        return next(err);
      } else if (req.user._id.toString() === req.body.id) {
        var err = new Error("You can't add your own profile");
        return next(err);
      }

      // find the current user's profile
      Profile.findOne({userID: req.user._id.toString()}).exec()
        .then(function (profile) {
          // if the profile hasnt been created yet, throws errror
          if (!profile) {
            var err = new Error("Profile not created yet");
            return next(err);
          }
          // set up search to see if provided id is already in list of IDs
          var newTrustedID = req.body.id
          var trustedIDList = profile.trustedIDs;
          var searchList = function(value) {
            if(newTrustedID === value) {
              return true;
            }
            return false;
          };

          // if the ID is already in there, throw an error
          if(trustedIDList.some(searchList)) {
            var err = new Error("Profile already added to list");
            return next(err)
          }

          // add the ID to the list
          trustedIDList.push(newTrustedID);

          // update the profile with the new ID list
          Profile.update({userID: req.user._id.toString()}, {trustedIDs: trustedIDList})
            .then(function() {
              res.sendStatus(200);
            })
          ;
        })
        .catch(function (err) {
          return nect(err);
        })
      ;
    },

    del: function(req, res, next) {
      if(!req.user) {
        var err = new Error("Log in first");
        return next(err);
      } else if (!req.body.id) {
        var err = new Error("No ID provided");
        return next(err);
      }

      Profile.findOne({userID: req.user._id.toString()}).exec()
        .then(function (profile) {
          // if the profile hasnt been created yet, throws errror
          if (!profile) {
            var err = new Error("Profile not created yet");
            return next(err);
          }

          var oldTrustedID = req.body.id;
          var trustedIDList = profile.trustedIDs;
          var searchList = function(value) {
            if (oldTrustedID === value) {
              return true;
            }
            return false;
          }
          var oldIdIndex = trustedIDList.indexOf(searchList);
          if (oldIdIndex === -1) {
            var err = new Error("ID not found in list of trusted users");
            return next(err);
          }
          trustedIDList.splice(oldIdIndex, 1);

          Profile.update({userID: req.user._id.toString()}, {trustedIDs: trustedIDList})
            .then(function() {
              res.sendStatus(200);
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
