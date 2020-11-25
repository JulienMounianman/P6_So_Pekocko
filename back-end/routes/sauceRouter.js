const express = require('express');
const ctrl = require('../controllers/sauceController');
const router = express.Router();

router.get('/', ctrl.getAllSauces);
router.get('/:id', ctrl.getOneSauces);
router.post('/', ctrl.createSauce);
router.put('/:id', ctrl.updateSauce);
router.delete('/:id', ctrl.deleteOneSauce);
router.post('/:id/like', ctrl.updateLikeSauce);
module.exports = router;