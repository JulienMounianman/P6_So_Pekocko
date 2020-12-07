const express = require('express');
const ctrl = require('../controllers/sauceController');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, ctrl.getAllSauces);
router.get('/:id', auth, ctrl.getOneSauces);
router.post('/', auth, multer, ctrl.createSauce);
router.put('/:id', auth, multer, ctrl.updateSauce);
router.delete('/:id', auth, ctrl.deleteOneSauce);
router.post('/:id/like', auth, ctrl.updateLikeSauce);
module.exports = router;