var express = require('express');
var router = express.Router();
var profCtrl = require('../controllers/profile');

// base profile routes
router.route('/')
  .get(profCtrl.root.get)
  .post(profCtrl.root.post)
  .patch(profCtrl.root.patch)
;

// trusted profile routes
router.route('/trust')
  .get(profCtrl.trust.get)
  .post(profCtrl.trust.post)
  .delete(profCtrl.trust.del)
;

// specific ID profile routes
router.get('/:id', profCtrl.byID.get);

module.exports = router;
