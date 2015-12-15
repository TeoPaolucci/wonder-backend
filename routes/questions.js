var express = require('express');
var router = express.Router();
var questCtrl = require('../controllers/question');

// all question routes '/question'
router.route('/')
  // GET all Qs
  .get(questCtrl.root.get)
  // POST new question of current user
  .post(questCtrl.root.post)
;

// user question routes '/question/user'
  // GET all questions by current user
router.get('/user', questCtrl.user.get);

// user id question routes '/question/user/:id'
  // GET all questions by user with :id
router.get('/user/:id', questCtrl.user.getByID);

// question id routes '/question/:id'
router.route('/:id')
  // GET that question
  .get(questCtrl.byID.get)
  // POST an ANSWER to that question
  .post(questCtrl.byID.post)
  // PATCH the question with new info
  .patch(questCtrl.byID.patch)
  // DELETE that question
  .delete(questCtrl.byID.del)
;

module.exports = router;
