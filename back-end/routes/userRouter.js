const express = require('express');
const ctrl = require('../controllers/userController');
const router = express.Router();

router.post('/signup', ctrl.signup);

module.exports = router;
